
let content=new Array(3);
content[0]=`<h2 >Minimize travelling time and explore more on your tours </h2>  `;
content[1]=`<h2 >Minimize cost of goods transportation</h2>  `;
content[2]=`<h2 >Enjoy your roadtrips in minimal costs</h2>  `;
let content1=new Array(3);
content1[0]=`<img src=" Images/tour.jpg" class="d-block w-100 " alt="..."> `;
content1[1]=`<img src="Images/truck.jpg" class="d-block w-100" alt="..." >  `;
content1[2]=`<img src="Images/roadtrip.jpg" class="d-block w-100" alt="..."> `;
let cnt=0;

if(cnt==3) cnt=0;
ss.innerHTML= content[cnt];
inj.innerHTML= content1[cnt];
if(cnt==0)
{
  
  ic1.style.border="5px solid grey";
  ic2.style.border="none";
  ic3.style.border="none";

}
if(cnt==1)
{
  ic1.style.border="none";
  ic2.style.border="5px solid grey";
  ic3.style.border="none";

}
if(cnt==2)
{
  ic1.style.border="none";
  ic2.style.border="none";
  ic3.style.border="5px solid grey";
}

cnt++;


setInterval(()=>
{
  
    if(cnt==3) cnt=0;
  ss.innerHTML= content[cnt];
  inj.innerHTML= content1[cnt];
  if(cnt==0)
  {
    
    ic1.style.border="5px solid grey";
    ic2.style.border="none";
    ic3.style.border="none";
  
  }
  if(cnt==1)
  {
    ic1.style.border="none";
    ic2.style.border="5px solid grey";
    ic3.style.border="none";

  }
  if(cnt==2)
  {
    ic1.style.border="none";
    ic2.style.border="none";
    ic3.style.border="5px solid grey";
  }
 
 cnt++;
},3000);
