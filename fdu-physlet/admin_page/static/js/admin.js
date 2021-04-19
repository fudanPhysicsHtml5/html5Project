var delete_url = "fuck";
var delete_name = ""

function delete_project(url, title) {
    delete_url = url;
    delete_title = title
    form = new FormData();
    form.append('title', delete_title);
    $.ajax({
        url: delete_url,
        type: 'POST',
        cache: false,
        processData: false,
        contentType: false,
        data: form,
        success: function(data) {
            location.reload();
            alert("删除成功");
        }
    });
    //$("#delete_btn").click();
}

function uploaded_projects() {
    $("#Uploaded_projects").addClass("active");
    $("#Manage_projects").removeClass();
};

function manage_projects() {
    $("#Manage_projects").addClass("active");
    $("#Uploaded_projects").removeClass();
}

$("#comment_button").click(function() {
    var reason = $("#reason").val();
    var form = new FormData();
    form.append('reason', reason);
    form.append('name', delete_name);
    $.ajax({
        url: delete_url,
        type: 'POST',
        cache: false,
        data: form,
        processData: false,
        contentType: multipart / form - data,
    });
});