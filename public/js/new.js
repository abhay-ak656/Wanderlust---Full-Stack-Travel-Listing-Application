
    document.addEventListener('DOMContentLoaded',()=>{
       const conatiner=document.querySelector('.newcontainer');
        if(window.innerWidth<=990){
            conatiner.classList.remove('offset-2','col-8');
            conatiner.classList.add('col-12');
        }
    })

       const dropbtn=document.querySelector('.dropdownbtn');
       const dropitem=document.querySelectorAll('.dropdown-item');

       dropitem.forEach((item)=>{
         item.addEventListener('mouseover',()=>{
            item.style.backgroundColor='lightblue';
         })

         item.addEventListener('mouseout',()=>{
            item.style.backgroundColor='';
         })

           item.addEventListener('click',()=>{
            dropbtn.classList.remove('btn-secondary');
            dropbtn.classList.add('btn-success');
            dropbtn.textContent=item.textContent;
            let input=document.querySelector('#categoryinput');
            input.value=dropbtn.textContent;
           })
         
       })