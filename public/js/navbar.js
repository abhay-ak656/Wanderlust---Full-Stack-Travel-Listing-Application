const collapse=document.getElementById('navbarNavAltMarkup');
const formswitch=document.querySelector('.form-switch');
 const btn = document.querySelector('.search button');
 document.addEventListener('DOMContentLoaded',()=>{
    if(window.innerWidth<=600){
     btn.innerHTML='<i class="fa-solid fa-magnifying-glass" style="margin-right: 0.5rem;"></i>';
     collapse.appendChild(formswitch);
  }
 });


 const toggle=document.querySelector('.navbar-toggler');
 let tog=false;

      toggle.addEventListener('click', () => {
         tog=!tog;
        if(tog){
          collapse.style.backgroundColor='white';
           collapse.classList.add('border-top', 'mt-3', 'pb-3')
        }else{
           collapse.style.backgroundColor='none';
          collapse.classList.remove('border-top', 'mt-3', 'pb-3')
        }
  });


    document.addEventListener('DOMContentLoaded',()=>{
     const container=document.getElementById("categoryScroll");
   const leftarrow=document.getElementById("scrollarrow_left");
   const rightarrow=document.getElementById("scrollarrow_Right");

    function updatebtn(){
      leftarrow.disabled=container.scrollLeft===0;
      rightarrow.disabled=container.scrollLeft+container.clientWidth>=container.scrollWidth;
    }


   function sl(){
      container.scrollBy({left:-200, behavior:"smooth"});
      setTimeout(updatebtn,300);
   }

   function scrollRight(){
      container.scrollBy({left:200, behavior:"smooth"});
      setTimeout(updatebtn,300);
   }
    
   container.addEventListener('scroll',updatebtn);
   window.sl=sl;
   window.scrollRight=scrollRight;

   updatebtn();

  });
    const formcheck=document.querySelector('.form-check-input');
    let isclick=false;
    formcheck.addEventListener('change',()=>{
      isclick=!isclick;

      const gstApply=document.querySelectorAll('#GST');
      if(isclick){
      gstApply.forEach((i)=>{
        i.style.display='inline';
      })
    }else{
       gstApply.forEach((i)=>{
        i.style.display='none';
      })
    }
    })
