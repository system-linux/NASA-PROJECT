document.getElementById("geri").onclick= function () {
    window.location.href = "/";
}
document.getElementById("sondMessage").onclick= function() {
    var inputValue = document.getElementById("myInput").value.trim();
    if (inputValue === "") {
        alert("Lütfen bir değer girin!");
    }
}