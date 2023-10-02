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
//variaveis

async function init() {
  const { data, error } = await _supabase.from("mensages").select();

  return data;
}

const updateList = () => {
  msg = [];
  list.innerHTML = "";
  init().then((value) => {

    value.forEach((element) => {
      msg.push(element);
    });
 
    msg.map((value,index) => {
        console.log(value);
      list.innerHTML += `<li>
    <div class="ball_msg">
        <span class="nickname_ball_msg">Ze</span>
        <div > 
        <span class="msg">${value.datamsg}</span>
        <button id='delete' onclick='delet(${value.id})'>X</button>
        </div>
       
    </div>
    </li>`;
    });
    setTimeout(list.scrollIntoView({ behavior: "smooth" }), 300);
    boxmsg.value = null;
  });
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
msg=[]
  let valueBoxMenssage = boxmsg.value;
  if (boxmsg.value != "") {
    const { error } = await _supabase
      .from("mensages")
      .insert({ datamsg: valueBoxMenssage });
  
  }
}

async function delet(index) {
    const { error } = await _supabase
    .from("mensages")
    .delete()
    .eq('id', index)
 
}