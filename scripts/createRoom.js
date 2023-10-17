const { createClient } = supabase;

// Create a single supabase client for interacting with your database
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3NoZmR2d29jZnR6cXV0aHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU4MzUwNDAsImV4cCI6MjAxMTQxMTA0MH0.rTKp9LT3w46TM7BiMXV4a-BO553h9uy5bfk8prWYyQ8";
const _supabase = createClient("https://qlwshfdvwocftzquthsv.supabase.co", key);

let inputBoxCode = document.getElementById("inputBoxCode");
const spanCode = document.getElementById("code");
let code;
function geraStringAleatoria(tamanho) {
  var stringAleatoria = '';
  var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijlmnopqrstuvwxyz0123456789';
  for (var i = 0; i < tamanho; i++) {
      stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return stringAleatoria;
}

async function getId() {
  code = geraStringAleatoria(8)
  inputBoxCode.value = code;
  inputBoxCode.select();
  inputBoxCode.setSelectionRange(0, 99999);
  document.execCommand("copy");




  document.getElementById("menssage").style.top = "2em"
  document.getElementById("menssage").style.transitionDuration = "0.5s"

}





async function enterRoom() {
   
   const { error } = await _supabase.from("salas").insert({ key_room: code });
 
  window.location.assign("/chat.html");
     
}
