 const likeButtons = document.querySelectorAll('.likebtn');
  likeButtons.forEach((button)=>{
    const heartIcon=button.querySelector('i');
     button.addEventListener('click', async (e)=>{
      e.preventDefault();
        e.stopPropagation();
      const listingId=button.dataset.id;

      if(heartIcon.classList.contains('fa-solid')){
          
            try {
          const response= await fetch(`/listing/${listingId}/fav`,{
            method:'DELETE',
            headers:{
              'content-type':'application/json'
            }
          });
            const data = await response.json();
           if(data.success){
            heartIcon.classList.add('fa-regular');
         heartIcon.classList.remove('fa-solid');
         heartIcon.classList.remove('liked');
          window.location.reload();
              alert(data.message);
           }else{
             alert('not delete');
           }
         } catch (err) {
          alert(err);
         }
         return;
      };

         try {
          const response= await fetch(`/listing/${listingId}`,{
            method:'POST',
            headers:{
              'content-type':'application/json'
            }
          });
            const data = await response.json();
           if(data.success){
             heartIcon.classList.remove('fa-regular');
             heartIcon.classList.add('fa-solid');
            heartIcon.classList.add('liked');
              alert(data.message);
           }else{
            window.location.replace('/listing/user/login');
             alert(data.message);
           }
         } catch (err) {
          console.log(err);
         }
    })
  })
  