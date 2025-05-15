

document.addEventListener('DOMContentLoaded',()=>{
	const conatiner=document.querySelector('.main');
	if(window.innerWidth<=778){
		conatiner.classList.remove('col-6','offset-3')
        conatiner.classList.add('col-12');
	}
})