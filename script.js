var msg = {
    "msg":[]

}
var boxmsg = document.getElementById('box_Msg')
var list = document.getElementById('list_ul')











function send() {
   
if (boxmsg.value != "") {
    
    list.innerHTML = ""
msg.msg.push(boxmsg.value)

msg.msg.map((value) =>{
 
    list.innerHTML +=   `<li>
<div class="ball_msg">
    <span class="nickname_ball_msg">Ze</span>
    <span class="msg">${value}</span>
</div>
</li>`
    })
    boxmsg.value = null
}




}

