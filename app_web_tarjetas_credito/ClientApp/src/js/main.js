const btn_mg = document.querySelector(".btn_mg__primary");
const dropdown = document.querySelector('#profile');
const dropdown_mg = document.querySelector('#dropdown_mg');
const sidebar_btn = document.querySelector("#toggle-sidebar");
const sidebar = document.querySelector("#sidebar");
const item_master = document.querySelectorAll(".item__master");

sidebar_btn.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleSidebar();
});
dropdown.addEventListener("click", function(e){
    e.stopPropagation();
    toggleDropdown();
});

function toggleDropdown(){
    console.log( dropdown);
    dropdown_mg.classList.toggle('active')
}

function toggleSidebar(){
    sidebar.classList.toggle('sidebar_min');
}

btn_mg.addEventListener('click', function(e){
    console.log('asda');
    const span = document.createElement('span');
    console.log(span);
    span.classList.add('ripple');
    btn_mg.appendChild(span);

    span.addEventListener('animationend', function(e){
        span.remove();
    });
});

item_master.forEach(item => {
    item.addEventListener('click', function(e){
        const child = item.nextSibling;
        console.log(child);
        child.nextSibling.classList.toggle('show');
    });
});