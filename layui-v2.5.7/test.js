var host = "http://127.0.0.1:8000/";

$("#button1").click(function(){
    layer.open({
        type: 1, 
        title: "上传项目",
        area: ["500px", "200px"],
        content: "<div class=\"layui-form-item\"> <label class=\"layui-form-label\">文件名</label> <div class=\"layui-input-block\"><input style=\"width: 85%\" type=\"text\" name=\"title\" required  lay-verify=\"required\" placeholder=\"请选择文件\" readOnly=true autocomplete=\"off\" class=\"layui-input\" id=\"text1\"></div> \
        </div> \
        <div style=\"text-align:center\"> \
        <input type=\"button\" value=\"选取文件\" class=\"layui-btn layui-btn-normal\" onclick=\"getFile()\"> \
        <input style=\"display: none\" type=\"file\"  accept=\".zip\" name=\"file\" id=\"getF\" onchange=\"clickF()\"> \
        <button type=\"button\" class=\"layui-btn\" id=\"test9\" onclick=\"uploadFile()\">开始上传</button> \
        </div>",
        btnAlign: 'c'
      });
});

function getFile() {
    $("#getF").click();
}

var filename="";
function clickF() {
    filename=$("#getF").val();
    var filenames=filename.split("\\");
    filename=filenames[filenames.length-1];
    $("#text1").val(filename);
}

function uploadFile() {
    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    let file = $("#getF")[0].files[0];
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200)
        {
            alert("yes");
            alert(xhr.responseText);
        }
    }
    formData.append("file", file);
    xhr.open("post", host + "physics/upload");
    xhr.send(formData);
    alert(host + "upload");
}