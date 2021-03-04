var host = "http://127.0.0.1:8000/";

$("#upload_button").click(function() {
    layer.open({
        type: 1,
        title: "上传项目",
        area: ["400px", "250px"],
        content: "<div style = \"text-align:center\"> \
        <br><div><label class=\"layui-form-label\">项目名称</label><div class=\"layui-input-block\"><input autocomplete=\"off\" id=\"projectName\" style=\"width: 86%\" type=\"text\" name=\"项目名称\" placeholder=\"请输入项目名称\" class=\"layui-input\"></div></div>\
        <br><div align=\"left\" class=\"layui-form-item\"><label class = \"layui-form-label\">文件名称</label> <div class=\"layui-input-inline\"><input style=\"width: 107%\" type=\"text\" name=\"title\" required  lay-verify=\"required\" placeholder=\"请选择文件(zip,7z,rar格式)\" readOnly=true autocomplete=\"off\" class=\"layui-input\" id=\"text1\"></div><input type = \"button\" value=\"...\" class=\"layui-btn layui-btn-primary\" onclick=\"getFile()\"></div>\
        <br><div class=\"layui - input - block\" >\
        <input style=\"display: none\" type=\"file\"  accept=\".zip,.7z,.rar\" name=\"file\" id=\"getF\" onchange=\"clickF()\"> \
        <button type=\"button\" class=\"layui-btn layui-btn-normal\" id=\"test9\" onclick=\"uploadFile()\">开始上传</button></div>\
        </div>",
        btnAlign: 'c'
    });
});

$("#physics_button").click(function() {
    window.location.href = "http://127.0.0.1:8000/physics/model";
    // $.ajax({
    //     url: host + "physics/model",
    //     type: "get",
    //     data: "physics",
    //     //cache: false,        // 不缓存数据
    //     processData: false, // 不处理数据
    //     contentType: false, // 不设置内容类型
    //     success: function(data) {
    //         document.write(data);
    //         document.close();
    //         // newWindow = window.open(host + "physics/model", '');
    //     }
    // });
})

function getFile() {
    $("#getF").click();
}

var filename = "";

function clickF() {
    filename = $("#getF").val();
    var filenames = filename.split("\\");
    filename = filenames[filenames.length - 1];
    $("#text1").val(filename);
}

function uploadFile() {
    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    // let file = $("#getF")[0].files[0];
    // formData.append("file", file);
    // formData.append("name", $("#projectName").val());
    // // if name or file is not input, alert
    // $("#text1").val();
    // if ($("#projectName").val() == "" || $("#projectName").val() == "请输入项目名称") {
    //     layer.alert("请输入项目名称");
    // } else if ($("#text1").val() == "请选择文件" || $("#text1").val() == "") {
    //     layer.alert("请选择项目文件");
    // } else {
    //     $.ajax({
    //         url: host + "physics/upload",
    //         type: "POST",
    //         headers: { "X-CSRFToken": $.cookie("csrftoken") },
    //         data: formData,
    //         //cache: false,        // 不缓存数据
    //         processData: false, // 不处理数据
    //         contentType: false, // 不设置内容类型
    //         success: function(data) {
    //             alert(data);
    //         }
    //     });
    // }

    formData.append("username", "test");
    formData.append("password", "test")
    $.ajax({
        url: host + "physics/log_in",
        type: "POST",
        headers: { "X-CSRFToken": $.cookie("csrftoken") },
        contentType: 'application/json;charset=utf-8',
        data: formData,
        //cache: false,        // 不缓存数据
        processData: false, // 不处理数据
        contentType: false, // 不设置内容类型
        success: function(data) {
            alert(data);
        }
    });

    // xhr.open("POST", host + "physics/upload");
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState==4 && xhr.status==200)
    //     {
    //         alert(xhr.responseText);
    //     }
    // }
    // xhr.send(formData);
}