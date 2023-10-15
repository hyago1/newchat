const { createClient } = supabase;
window.HTMLElement.prototype.scrollIntoView = function () {};
// Create a single supabase client for interacting with your database
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3NoZmR2d29jZnR6cXV0aHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU4MzUwNDAsImV4cCI6MjAxMTQxMTA0MH0.rTKp9LT3w46TM7BiMXV4a-BO553h9uy5bfk8prWYyQ8";
const _supabase = createClient("https://qlwshfdvwocftzquthsv.supabase.co", key);

//variaveis
var msg = [];
let status;
let list_myContact_Added = []
var usersList = []
var emailAdded = false
var boxmsg = document.getElementById("box_Msg");
var list = document.getElementById("list_ul");
var listUsers = document.getElementById("list_users");
var lisMyContacts = document.getElementById("list_myContact");
var codeInfo = document.getElementById("code");
var dt = new Date();
let code;
let mycode

//variaveis


let fileList;
        
const fileSelector = document.getElementById('file');
fileSelector.addEventListener('change', (event) => {
fileList = event.target.files[0];

});






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
  console.log(mycode);
  let { data: contacts , error} = await _supabase
  .from("contacts")
  .select( "owner, contact").eq("owner",mycode).eq("contact", idValue)
console.log(contacts);
    lisMyContacts.innerHTML = ""
   console.log(idValue);
   
  if (contacts == 0) { 
    const { err } = await _supabase.from("contacts").insert({
     owner:mycode,
     contact: idValue,
    });}else{alert("Ja está na sua lista")}

    document.getElementById('searchUsers').style.display = "none"
    listUsers.style.display = "none"


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

async function openChat() {


  const { dataa } = await _supabase
  .from('users')
  .update({ online: true })
  .eq('id', mycode)
  const { data } = await _supabase.auth.getSession();



  getUsers().then((value)=>{ 
    usersList = []
    listUsers.innerHTML = ""
    value.forEach((value)=>{
      usersList.push(value)
    })

    usersList.map((value,index)=>{



      listUsers.innerHTML += `<li >
      <div id="" onclick="closeChat(${value.id})" class="userContact">

    <div class='divMainContacts'">  
     <div class='userContactInfo'>
            <div id='nicks'> 
            <img onclick="openMenu()"class='userContactImgProfile' src='${value.imgProfile}'></img>

      <span id='status${value.id}'> ${value.name}</span><br>
            </div>
           
        <span>Email: ${value.email}</span><br>
        <span>Code: ${value.id}</span>
      </div>  
      <div class='add' onclick='addMyContacts(${value.id})' title='Adcionar como "meu"'>+</div>
        </div>
         
      </div>
    </li>`


        if (value.online == true) {
    
      document.getElementById('status'+value.id).style.color =  '#00ff14'
    
    }
    else{
 
      document.getElementById('status'+value.id).style.color =  'white'    
    
    }
    })







    

})    

const mediaQuery = window.matchMedia('(min-width: 768px)')
if (mediaQuery.matches) {
  document.getElementById('menuContactMenssages').style.width = "40%"
}else{
  document.getElementById('menuContactMenssages').style.width = "70%"
}

  document.getElementById('menuContactMenssages').style.left = "0px"
  document.getElementById('menuContactMenssages').style.transition = "0.7s"


  let { data: users  } = await _supabase
  .from("users")
  .select("id").eq("email" ,data.session.user.email );
  
  mycode = users[0].id


  

console.log(mycode);
let { data: contacts , error} = await _supabase
.from("contacts")
.select("users(id,name,email,imgProfile)").eq("owner",mycode );



list_myContact_Added = []
contacts.forEach((value)=>{
  list_myContact_Added.push(value)
})


console.log(list_myContact_Added);
lisMyContacts.innerHTML = ""

list_myContact_Added.map((value)=>{
lisMyContacts.innerHTML +=`<li>
  <div id="" onclick="closeChat(${value.users.id})" class="userContact">
  <div class='divMainContacts'">  
        <div class='userContactInfo'>
        <div id='nicks'> 
        <img onclick="openMenu()"class='userContactImgProfile' src='${value.users.imgProfile}'></img>

        <span id='status${value.id}'> ${value.users.name}</span><br>
        </div>
       
    <span>Email: ${value.users.email}</span><br>
    <span>Code: ${value.users.id}</span>
  </div>
  <img width="24" height="24" class='favorite' src="./iconSaved.svg" alt="hearts"/>
    </div>
  </div>
</li>`
})


lisMyContacts.animate(
  [
   
    { transform: "scale(1)" },
    { transform: "scale(0.98)" },
    { transform: "scale(0.96)" },
    { transform: "scale(0.93)" },
    { transform: "scale(0.97)" },
    { transform: "scale(1)" },
  ],
  {
    duration: 470,
    direction: "alternate",
  }
);






}






_supabase
.channel('any')
.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, payload => {

  if (payload.new.online == true) {
  
    if (document.getElementById('status'+payload.new.id)) {
       document.getElementById('status'+payload.new.id).style.color =  '#00ff14'
  
    }
   
  }
  else{
if (document.getElementById('status'+payload.new.id)) {
  document.getElementById('status'+payload.new.id).style.color =  'white'    
}
    
  
  }
})
.subscribe()


document.addEventListener('touchmove', function(e) {
  var x = e.touches[0].clientX;
  console.log(x);
  if (x >15 && x < 30 ) {
    openChat()
    x = null
  }
});

var selected = false
async function closeChat(value) {
  const { data } = await _supabase.auth.getSession();



let { data: users  } = await _supabase
.from("users")
.select("id").eq("email" ,data.session.user.email );

const needle = usersList.find((currObj) => {
  // Note que o callback retornará `true` se o objeto
  // atual tiver propriedade `id` igual a 2.
  return currObj.id === value
});

if (document.getElementById("avatarSelected")) {
  document.getElementById("avatarSelected").remove()
}

console.log(needle);
document.getElementById('infoContacts').innerHTML += `<div id='avatarSelected'><img  class='imgAvatarSelected' src='${needle.imgProfile}'></img><p id='nameAvatarSelected'>${needle.name}</p></div>`;
selected = true
mycode = users[0].id

if (value != mycode) {
  if (mycode>value) {
    code = "k"+mycode+""+value
    console.log(mycode);
  }
  else{
   code = "k"+value+""+mycode
   console.log(code);
  }
   
 } // code = value+mycode
else{
  alert("Voce não pode mandar menssagens pra si mesmo")
}



 let { data: salas , error} = await _supabase
 .from("salas")
 .select( "key_room").eq("key_room",code)
console.log(salas);

   const { err } = await _supabase.from("salas").insert({ key_room: code });





        document.getElementById('menuContactMenssages').style.width = "0%"
  document.getElementById('menuContactMenssages').style.left = "-1000px"
  document.getElementById('menuContactMenssages').style.transition = "0.3s"
  updatePage()
}
async function closePainelChats(value) {


  document.getElementById('menuContactMenssages').style.left = "-1000px",
    
  document.getElementById('menuContactMenssages').style.width = "0%",

 document.getElementById('menuContactMenssages').style.transition = "1.5s"
  // document.getElementById('menuContactMenssages').style.left = "-1000px"
 

}





async function openMenu() {




  document.getElementById("option").style.display = "flex";
  document.getElementById("option").style.transform = "transform: scaleZ(1.4);";
}
function closeMenu() {
  document.getElementById("option").style.display = "none";
}

async function longinGoogle() {
  _supabase.auth.signInWithOAuth({
    provider: "google",
  }
  
  ,
  { resizeTo: 'http://127.0.0.1:5500/chat.html' });



 


}

function getHour() {
  let hour = new Date().getHours();
  let minutes = new Date().getMinutes();
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

 


  msg = [];

  const { data } = await _supabase.auth.getSession();

  let { data: users } = await _supabase
  .from("users")
  .select("email, id").eq("email", data.session.user.user_metadata.email);
  console.log("updatePage()");
  mycode = users[0].id

  if (users == 0) {
     const { error } = await _supabase.from("users").insert({
    email: data.session.user.user_metadata.email,
    name: data.session.user.user_metadata.name,
     imgProfile:data.session.user.user_metadata.avatar_url
  });

  }
  else{
  console.log("esse email ja existe");
  }
     










if (code != undefined || code != "NaN" || code != null) {
  init().then(async (value) => {
    let avatar = document.getElementById("avatar");
  


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



      
  

if (value.file == true) {
  list.innerHTML += `<li>
  <div class="ball_msg">
  <div class='info_details'>  

  <span id="nickname_ball_msg">${value.nickname}</span>

      <button id='delete'alt='Deletar mensagem' onclick='delet(${value.id})'>X</button>
  
      </div>

      <div class='info' > 
      <span class="msg"><img id='imgMsg' src="${value.datamsg}"></img></span>
      <span id='hour'>${formatedTime}</span>
      
      </div>
     
  </div>
  </li>`;

}else{
    list.innerHTML += `<li>
    <div class="ball_msg">
    <div class='info_details'>  

    <span id="nickname_ball_msg">${value.nickname}</span>

        <button id='delete'alt='Deletar mensagem' onclick='delet(${value.id})'>X</button>
    
        </div>
 
        <div class='info' > 
        <span class="msg">${value.datamsg}</span>
        <span id='hour'>${formatedTime}</span>
        
        </div>
       
    </div>
    </li>`;

}
      
  

    });
  });
}


  

};



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
if (payload.new.file == false) {
       if (
        
          payload.new.datamsg.startsWith("http://") ||
          payload.new.datamsg.startsWith("https://") ||
          payload.new.datamsg.startsWith("www.")
        ) {
          datamsg = `<a href='${payload.new.datamsg}'>${payload.new.datamsg}</a>`;
        }
}
   
        let formatedTime = payload.new.created_at.slice(0, 5);

        if (payload.new.file == true) {
          list.innerHTML += `<li >
        <div id='${payload.new.id}' class="ball_msg">
        <div class='info_details'>  
 
        <span id="nickname_ball_msg">${payload.new.nickname}</span>

         <button id='delete'alt='Deletar mensagem' onclick='delet(${payload.new.id})'>X</button>
 
         </div>
  
         <div class='info' > 
         <span class="msg">
         <img id='imgMsg' src="${datamsg}"></img>
         </span>
         <span id='hour'>${formatedTime}</span>
         
         </div>
        
     </div>
     </li>`;}else{
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
     }


        

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
if (code != null) {
   codeInfo.textContent = ': Private';
}
 
  updatePage();
}






document.addEventListener("visibilitychange", async function () {
  if (
    document.visibilityState == "visible"
  ) {
    console.log("");
const { data, error } = await _supabase
.from('users')
.update({ online: true })
.eq('id', mycode)
      updatePage();
   
  }
  else{
    const { data, error } = await _supabase
.from('users')
.update({ online: false })
.eq('id', mycode)

      updatePage();
  }
  
  // Modify behavior...
});













async function send() {

  console.log(fileList);


console.log(fileList);
if (fileList == undefined) {
  if (code !=null) {
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
  else{
    alert("Escolha algum usuario para conversar ")
  }

}
else{

  const { dataa, error } = await _supabase
  .storage
  .from('img')
  .upload('/'+fileList.name, fileList, {
  cacheControl: '3600',
  upsert: false
  })

  const { data } = _supabase
  .storage
  .from('img')
  .getPublicUrl(fileList.name)
console.log(data);

let urlImg = data;

  if (code !=null) {
    const { data } = await _supabase.auth.getSession();
  let name
    let { data: users, error } = await _supabase
    .from("users")
    .select("name").eq("email" ,data.session.user.email );
  name = users[0].name
  
      const { errr } = await _supabase.from("mensages").insert({
        datamsg: urlImg.publicUrl,
        created_at: getHour(),
        key_room_message: code,
        nickname: name,
        file:true
      });
      document.getElementById("box_Msg").value = "";
    
  }
  else{
    alert("Escolha algum usuario para conversar ")
  }
}
  
}
function openListAllUsers(){
  let state
  listUsers.style.display = "initial"
  document.getElementById('searchUsers').style.display = "initial"
}
async function delet(index) {
  const { error } = await _supabase.from("mensages").delete().eq("id", index);

  updatePage();
}
