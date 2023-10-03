const { createClient } = supabase;

// Create a single supabase client for interacting with your database
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsd3NoZmR2d29jZnR6cXV0aHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU4MzUwNDAsImV4cCI6MjAxMTQxMTA0MH0.rTKp9LT3w46TM7BiMXV4a-BO553h9uy5bfk8prWYyQ8";
const _supabase = createClient("https://qlwshfdvwocftzquthsv.supabase.co", key);

let inputBoxCode = document.getElementById("inputBoxCode");
const spanCode = document.getElementById("code");
let code;
async function getId() {
  code = Math.floor(Math.random() * 99999999 + 999);
  inputBoxCode.value = code;
  inputBoxCode.select();
  inputBoxCode.setSelectionRange(0, 99999);
  document.execCommand("copy");
}

_supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "salas" },
    (payload) => {}
  )
  .subscribe();

async function enterRoom() {
    if (inputBoxCode.value!="") {
        try {
   const { error } = await _supabase.from("salas").insert({ key_room: code });
 } catch (error) {}
  window.location.assign("/chat.html");
    }
 
}
