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
  console.log(code);
  if (!codeCheck) {
    code = prompt("Digite o código da sala");
    codeCheck = true;
  }

  msg = [];
  list.innerHTML = "";

  codeInfo.textContent = code;

  init().then((value) => {
    value.forEach((element) => {
      msg.push(element);
    });

    msg.map((value, index) => {
      let formatedTime = value.created_at.slice(0, 5);

      list.innerHTML += `<li>
    <div class="ball_msg">
    <div class='info_details'>  

        <span class="nickname_ball_msg">user</span>
        <button id='delete'alt='Deletar mensagem' onclick='delet(${value.id})'>X</button>

        </div>
 
        <div class='info' > 
        <span class="msg">${value.datamsg}</span>
        <span id='hour'>${formatedTime}</span>
        
        </div>
       
    </div>
    </li>`;

    
    });
  });

 
  document.getElementById("list_ul").lastChild.scrollIntoView();

};

_supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "mensages" },
    (payload) => {
      updateList();
    }
  )
  .subscribe();

updateList();

async function send() {
  msg = [];
  let valueBoxMenssage = boxmsg.value;
  if (boxmsg.value != "") {
    const { error } = await _supabase
      .from("mensages")
      .insert({
        datamsg: valueBoxMenssage,
        created_at: getHour(),
        key_room_message: code,
      });
    document.getElementById("box_Msg").value = "";
  }
}

async function delet(index) {
  const { error } = await _supabase.from("mensages").delete().eq("id", index);
}
