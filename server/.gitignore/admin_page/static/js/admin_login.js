var target_url = "http://127.0.0.1:8000"

function if_logged_in() {
    $.ajax({
        url: {% url 'admin_page:login_in' %},
        type: "GET",
    });
}

$("#log_in_form").ajaxForm({
    url: {% url 'admin_page:login_in'%},
    type: "POST",
    success: function(data) {
        if (data == "login failed") {
            alert("用户名或密码错误，请重新输入");
        } else if (data == "login success") {
            window.location.href = "http://127.0.0.1:8000/admin_page";
        }
    }
});


if_logged_in();