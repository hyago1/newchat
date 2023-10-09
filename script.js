const { createClient } = supabase;
window.HTMLElement.prototype.scrollIntoView = function () {};
// Create a single supabase client for interacting with your database
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3NoZmR2d29jZnR6cXV0aHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU4MzUwNDAsImV4cCI6MjAxMTQxMTA0MH0.rTKp9LT3w46TM7BiMXV4a-BO553h9uy5bfk8prWYyQ8";
const _supabase = createClient("https://qlwshfdvwocftzquthsv.supabase.co", key);

//variaveis
var msg = [];
var usersList = []

var boxmsg = document.getElementById("box_Msg");
var list = document.getElementById("list_ul");
var listUsers = document.getElementById("list_users");
var lisMyContacts = document.getElementById("list_myContact");
var codeInfo = document.getElementById("code");
var dt = new Date();
let code;
let mycode

//variaveis







async function getUsers(params) {
  let { data: users, error } = await _supabase
  .from("users")
  .select("*");
  return users
}
async function getContact(params) {
  let { data: users, error } = await _supabase
  .from("contacts")
  .select("*");
  return users
}

async function addMyContacts(idValue) {


    lisMyContacts.innerHTML = ""
   console.log(idValue);
    const { err } = await _supabase.from("contacts").insert({
     owner:mycode,
     contact: idValue,
    });





    // getContact().then((value)=>{
   
    //    usersListMyContents.map((value,index)=>{

    //   lisMyContacts.innerHTML += `<li>
    //   <div id="" onclick="closeChat(${value.id})" class="userContact">
    //         <div class='userContactInfo'>
    //   <span>Nome: ${value.name}</span><br>
    //     <span>Email: ${value.email}</span><br>
    //     <span>Code: ${value.id}</span>
    //   </div>
    //   <div class='add' onclick='addMyContacts()' title="Adcionar como contato">+</div>
        
    //   </div>
    // </li>`
    // })
    // })
   

  

}


function openChat() {
  getUsers().then((value)=>{ 
    usersList = []
    listUsers.innerHTML = ""
    value.forEach((value)=>{
      usersList.push(value)
    })
   
    usersList.map((value,index)=>{

      listUsers.innerHTML += `<li>
      <div id="" onclick="closeChat(${value.id})" class="userContact">
            <div class='userContactInfo'>
            <img onclick="openMenu()"class='userContactImgProfile' src='${value.imgProfile}'></img><br>
      <span>Nome: ${value.name}</span><br>
        <span>Email: ${value.email}</span><br>
        <span>Code: ${value.id}</span>
      </div>
      <div class='add' onclick='addMyContacts(${value.id})' title="Adcionar como contato">+</div>
        
      </div>
    </li>`
    })


    

})    

  document.getElementById('menuContactMenssages').style.width = "70%"
  document.getElementById('menuContactMenssages').style.left = "0px"
  document.getElementById('menuContactMenssages').style.transition = "0.4s"
}
async function closeChat(value) {
  const { data } = await _supabase.auth.getSession();

let { data: users  } = await _supabase
.from("users")
.select("id").eq("email" ,data.session.user.email );
mycode = users[0].id
 code = value+mycode

  const { error } = await _supabase.from("salas").insert({ key_room: code });




  document.getElementById('menuContactMenssages').style.width = "0%"
  document.getElementById('menuContactMenssages').style.left = "-1000px"
  document.getElementById('menuContactMenssages').style.transition = "0.4s"
  updatePage()
}
async function closePainelChats(value) {


  document.getElementById('menuContactMenssages').style.width = "0%"
  document.getElementById('menuContactMenssages').style.left = "-1000px"
  document.getElementById('menuContactMenssages').style.transition = "0.4s"
  updatePage()
}





function openMenu() {




  document.getElementById("option").style.display = "flex";
  document.getElementById("option").style.transform = "transform: scaleZ(1.4);";
}
function closeMenu() {
  document.getElementById("option").style.display = "none";
}

async function longinGoogle() {
  _supabase.auth.signInWithOAuth({
    provider: "google",
  });




  const { data } = await _supabase.auth.getSession();

getUsers().then(async (users)=>{
  let confirmation;

  if (users == undefined) {

    const { error } = await _supabase.from("users").insert({
      email: data.session.user.user_metadata.email,
      name: data.session.user.user_metadata.name,
    });
  } else {    

    users.forEach((value) => {
  
      if (value.email == data.session.user.user_metadata.email) {
        confirmation = true;
      }
      else{
        confirmation = false
      }
    });
  }
  
  if (!confirmation) {
  
    const { error } = await _supabase.from("users").insert({
      email: data.session.user.user_metadata.email,
      name: data.session.user.user_metadata.name,
      imgProfile:data.session.user.user_metadata.avatar_url
    });
  }
  
})



}

function getHour() {
  let hour = dt.getHours();
  let minutes = dt.getMinutes();
  let time = hour + ":" + minutes;
  return time;
}


let codeCheck = false;



async function enterRoom() {
  const { error } = await _supabase.from("salas").insert({ key_room: code });

}

async function init() {

  const { data, error } = await _supabase
    .from("mensages")
    .select()
    .eq("key_room_message", code);

  return data;
}




const updatePage = async () => {
  console.log(code);
  msg = [];


  const { data } = await _supabase.auth.getSession();

if (code != undefined || code != "NaN" || code != null) {
  init().then(async (value) => {
    let avatar = document.getElementById("avatar");
  

    console.log(data.session);
    let verificated;
    if (data.session.user.aud == "authenticated") {
      verificated = true;

 

      document.getElementById("login").style.display = "none";
      avatar.style.display = "block";
      avatar.innerHTML = `<img onclick="openMenu()" src='${data.session.user.user_metadata.avatar_url}'></img>`;

      document.getElementById("logout").style.display = "block";
    } else {
      document.getElementById("login").style.display = "block";
      document.getElementById("avatar").style.display = "none";
      document.getElementById("logout").style.display = "none";
    }

    value.forEach((element) => {
      msg.push(element);
    });

    list.innerHTML = "";

    msg.map((value, index) => {

      let formatedTime = value.created_at.slice(0, 5);
      let datamsg = value.datamsg;

      if (
        value.datamsg.startsWith("http://") ||
        value.datamsg.startsWith("https://") ||
        value.datamsg.startsWith("www.")
      ) {
        datamsg = `<a href='${value.datamsg}'>${value.datamsg}</a>`;
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
}


  

};

document.addEventListener("visibilitychange", function () {
  if (
    document.visibilityState == "visible" ||
    document.visibilityState == "hidden"
  ) {
    setTimeout(() => {
      updatePage();
    }, 3000);
  }
  // Modify behavior...
});

function logoutGoogle() {
  _supabase.auth.signOut();

  setTimeout(() => {
    window.location.href = "/index.html";
  }, 1360);
}

_supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "mensages" },
    async (payload) => {
      const { data, error } = await _supabase.auth.getSession();
      console.log(payload);

      // init().then(async (value) => {

      // });

      msg.push(payload.new);

      if (payload.new.key_room_message == code) {
        let datamsg = payload.new.datamsg;

        if (
          payload.new.datamsg.startsWith("http://") ||
          payload.new.datamsg.startsWith("https://") ||
          payload.new.datamsg.startsWith("www.")
        ) {
          datamsg = `<a href='${payload.new.datamsg}'>${payload.new.datamsg}</a>`;
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

        const e = document.getElementById("area_Menssage");
        const last = document.getElementById(payload.new.id);

        if (e.scrollTop >= e.scrollHeight - 800) {
          e.scrollTo({ top: e.scrollHeight, behavior: "smooth" });
        }

        last.animate(
          [
            { transform: "scale(3)" },
            { transform: "scale(2)" },
            { transform: "scale(1)" },
          ],
          {
            duration: 200,
            direction: "alternate",
          }
        );

        if (payload.new.nickname != data.session.user.email) {
          navigator.serviceWorker.register("sw.js");
          if (
            Notification.permission !== "denied" ||
            Notification.permission !== "default"
          ) {
            await Notification.requestPermission();
          }
          if (document.visibilityState == "hidden") {
            navigator.serviceWorker.ready.then((reg) => {
              reg.showNotification("chatCode", {
                title: payload.new.nickname,
                body: payload.new.datamsg,
                icon: "/android-launchericon-192-192.png",
              });
            });
          }
        }
      }
    }
  )
  .subscribe();

if (!codeCheck) {
  code = prompt("Digite o código da sala");
  codeCheck = true;
  codeInfo.textContent = code;
  updatePage();
}

async function send() {
  const { data } = await _supabase.auth.getSession();
  let valueBoxMenssage = boxmsg.value;
let name
  let { data: users, error } = await _supabase
  .from("users")
  .select("name").eq("email" ,data.session.user.email );
name = users[0].name
  if (boxmsg.value != "") {
    const { error } = await _supabase.from("mensages").insert({
      datamsg: valueBoxMenssage,
      created_at: getHour(),
      key_room_message: code,
      nickname: name,
    });
    document.getElementById("box_Msg").value = "";
  }
}

async function delet(index) {
  const { error } = await _supabase.from("mensages").delete().eq("id", index);

  updatePage();
}
