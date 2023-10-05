const { createClient } = supabase;
window.HTMLElement.prototype.scrollIntoView = function () {};
// Create a single supabase client for interacting with your database
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3NoZmR2d29jZnR6cXV0aHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU4MzUwNDAsImV4cCI6MjAxMTQxMTA0MH0.rTKp9LT3w46TM7BiMXV4a-BO553h9uy5bfk8prWYyQ8";
const _supabase = createClient("https://qlwshfdvwocftzquthsv.supabase.co", key);

//variaveis
var msg = [];
var boxmsg = document.getElementById("box_Msg");
var list = document.getElementById("list_ul");
var codeInfo = document.getElementById("code");
var dt = new Date();

//variaveis

function openMenu() {
  document.getElementById('option').style.display = "flex"
  document.getElementById('option').style.transform = "transform: scaleZ(1.4);"
}
function closeMenu() {
  document.getElementById('option').style.display = "none"
}


function longinGoogle() {
  _supabase.auth.signInWithOAuth({
    provider: "google",
  });
}

function getHour() {
  let hour = dt.getHours();
  let minutes = dt.getMinutes();
  let time = hour + ":" + minutes;
  return time;
}

let code;
let codeCheck = false;
async function init() {
  const { data, error } = await _supabase
    .from("mensages")
    .select()
    .eq("key_room_message", code);

  return data;
}

const updateList = () => {

  if (!codeCheck) {
    code = prompt("Digite o código da sala");
    codeCheck = true;
  }

  msg = [];
  list.innerHTML = "";

  codeInfo.textContent = code;

  init().then(async (value) => {
    let avatar = document.getElementById("avatar")
    const { data, error } = await _supabase.auth.getSession();
    console.log(data.session);
    let verificated;
    if (data.session.user.aud == "authenticated") {
      verificated = true;

      document.getElementById("login").style.display = "none";
     avatar.style.display = "block"
     avatar.innerHTML =`<img onclick="openMenu()" src='${data.session.user.user_metadata.avatar_url}'></img>`
      
      document.getElementById("logout").style.display = "block";
    } else {
      document.getElementById("login").style.display = "block";
      document.getElementById("avatar").style.display = "none"
      document.getElementById("logout").style.display = "none";
    }

    value.forEach((element) => {
      msg.push(element);
    });



    msg.map((value, index) => {
      let formatedTime = value.created_at.slice(0, 5);
      let datamsg = value.datamsg
   
      if (value.datamsg.startsWith("http://") || value.datamsg.startsWith("https://") || value.datamsg.startsWith("www.")) {
        datamsg = `<a href='${value.datamsg}'>${value.datamsg}</a>`
        }


      list.innerHTML += `<li>
    <div class="ball_msg">
    <div class='info_details'>  

    <span id="nickname_ball_msg">${value.nickname}</span>

        <button id='delete'alt='Deletar mensagem' onclick='delet(${value.id})'>X</button>

        </div>
 
        <div class='info' > 
        <span class="msg">${datamsg}</span>
        <span id='hour'>${formatedTime}</span>
        
        </div>
       
    </div>
    </li>`;
    });
  });
};

function logoutGoogle() {
  _supabase.auth.signOut();

  setTimeout(()=>{
    window.location.href = "/index.html"
  }, 5000);
}

const channel = _supabase.channel('any')
channel
  .on('presence', { event: 'join' }, () => {
    console.log('Synced presence state: ', channel.presenceState())
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ online_at: new Date().toISOString() })
    }
  })

_supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "mensages" },
    (payload) => {
       
        init().then((value) => {
          value.forEach((element) => {
            msg.push(element);
          });
          let datamsg = payload.new.datamsg

          if (payload.new.datamsg.startsWith("http://") || payload.new.datamsg.startsWith("https://") || payload.new.datamsg.startsWith("www.")) {
datamsg = `<a href='${payload.new.datamsg}'>${payload.new.datamsg}</a>`
}
          let formatedTime = payload.new.created_at.slice(0, 5);
          list.innerHTML += `<li >
        <div id='${payload.new.id}' class="ball_msg">
        <div class='info_details'>  
 
        <span id="nickname_ball_msg">${payload.new.nickname}</span>

         <button id='delete'alt='Deletar mensagem' onclick='delet(${payload.new.id})'>X</button>
 
         </div>
  
         <div class='info' > 
         <span class="msg">${datamsg}</span>
         <span id='hour'>${formatedTime}</span>
         
         </div>
        
     </div>
     </li>`;
        });

        document.getElementById("list_ul").lastChild.scrollIntoView();
   
    }
  )
  .subscribe();

updateList();

const channels = _supabase.getChannels()
console.log(channels);

async function send() {
  msg = [];

  const { data, error } = await _supabase.auth.getSession();
  let valueBoxMenssage = boxmsg.value;

  if (boxmsg.value != "") {
    const { error } = await _supabase
      .from("mensages")
      .insert({
        datamsg: valueBoxMenssage,
        created_at: getHour(),
        key_room_message: code,
        nickname: data.session.user.email,
      });
    document.getElementById("box_Msg").value = "";
  }
}

async function delet(index) {
  const { error } = await _supabase.from("mensages").delete().eq("id", index);



  updateList()
}
