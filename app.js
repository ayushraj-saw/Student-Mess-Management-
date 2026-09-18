const KEY = "smartMessData";

const seed = {
  user: null,
  bookings: [],
  feedback: [],
  complaints: [],
  wastage: [
    {day:"Mon",kg:18},{day:"Tue",kg:14},{day:"Wed",kg:11},{day:"Thu",kg:16},{day:"Fri",kg:9},{day:"Sat",kg:13},{day:"Sun",kg:10}
  ],
  menu: [
    {id:1,day:"Monday",breakfast:"Idli, Sambar, Chutney",lunch:"Rice, Dal, Mixed Veg, Curd",snacks:"Tea & Biscuits",dinner:"Chapati, Paneer Curry, Salad"},
    {id:2,day:"Tuesday",breakfast:"Poha, Banana, Tea",lunch:"Rice, Rajma, Aloo Gobi, Curd",snacks:"Samosa & Tea",dinner:"Veg Biryani, Raita"},
    {id:3,day:"Wednesday",breakfast:"Dosa, Sambar, Chutney",lunch:"Rice, Sambar, Beans, Rasam",snacks:"Fruit & Milk",dinner:"Chapati, Chana Masala"},
    {id:4,day:"Thursday",breakfast:"Paratha, Curd, Pickle",lunch:"Rice, Dal, Paneer, Salad",snacks:"Tea & Sandwich",dinner:"Rice, Veg Curry, Dal"},
    {id:5,day:"Friday",breakfast:"Upma, Coconut Chutney",lunch:"Rice, Chole, Veg Fry, Curd",snacks:"Pakoda & Tea",dinner:"Chapati, Mixed Veg, Dal"},
    {id:6,day:"Saturday",breakfast:"Puri, Aloo Curry",lunch:"Jeera Rice, Dal Makhani, Salad",snacks:"Juice & Biscuits",dinner:"Fried Rice, Manchurian"},
    {id:7,day:"Sunday",breakfast:"Pancakes, Fruit, Milk",lunch:"Special Veg Biryani, Raita",snacks:"Cake & Tea",dinner:"Pulao, Paneer, Salad"}
  ],
  announcements: [
    "Sunday special menu is now available.",
    "Please book your meals before 9:00 AM.",
    "Submit feedback after every meal to improve mess quality."
  ]
};

let data = JSON.parse(localStorage.getItem(KEY) || "null") || seed;
if (!data.menu?.length) data.menu = seed.menu;
if (!data.wastage) data.wastage = seed.wastage;
if (!data.announcements) data.announcements = seed.announcements;
save();

const app = document.getElementById("app");

function save(){ localStorage.setItem(KEY, JSON.stringify(data)); }
function esc(s=""){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function today(){ return new Date().toISOString().slice(0,10); }
function toast(msg){ const el=document.createElement("div"); el.className="toast"; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),2200); }

function loginPage(portal="student"){
  app.innerHTML = `
  <div class="login-page">
    <div class="login-card">
      <div class="logo">🍽️</div>
      <h1>Smart Mess</h1>
      <p class="muted">Smarter meals. Better management.</p>
      <div class="portal-tabs">
        <button class="${portal==="student"?"active":""}" onclick="loginPage('student')">Student Portal</button>
        <button class="${portal==="admin"?"active":""}" onclick="loginPage('admin')">Admin Portal</button>
      </div>
      <form onsubmit="doLogin(event,'${portal}')">
        <label>Email<input id="email" type="email" value="${portal==="student"?"student@demo.com":"admin@demo.com"}" required></label>
        <label>Password<input id="password" type="password" value="${portal==="student"?"student123":"admin123"}" required></label>
        <div id="loginError"></div>
        <button class="btn primary wide">Login as ${portal}</button>
      </form>
      <div class="demo-box">Demo: ${portal==="student"?"student@demo.com / student123":"admin@demo.com / admin123"}</div>
    </div>
  </div>`;
}

function doLogin(e, portal){
  e.preventDefault();
  const email=document.getElementById("email").value.trim().toLowerCase();
  const password=document.getElementById("password").value;
  const ok = portal==="student"
    ? email==="student@demo.com" && password==="student123"
    : email==="admin@demo.com" && password==="admin123";
  if(!ok){ document.getElementById("loginError").innerHTML='<div class="error">Invalid credentials for this portal.</div>'; return; }
  data.user={role:portal,name:portal==="student"?"Rahul Sharma":"Mess Administrator",email};
  save();
  render();
}

function layout(content, active){
  return `<div class="shell">
    <aside class="sidebar">
      <div class="brand">🍽️ <span>Smart Mess</span></div>
      <nav>
        ${data.user.role==="student" ? `
        <button class="${active==="dashboard"?"sel":""}" onclick="studentDashboard()">⌂ Dashboard</button>
        <button class="${active==="menu"?"sel":""}" onclick="studentMenu()">☰ Menu</button>
        <button class="${active==="bookings"?"sel":""}" onclick="studentBookings()">✓ My Meals</button>
        <button class="${active==="feedback"?"sel":""}" onclick="studentFeedback()">★ Feedback</button>
        <button class="${active==="complaints"?"sel":""}" onclick="studentComplaints()">⚑ Complaints</button>` : `
        <button class="${active==="dashboard"?"sel":""}" onclick="adminDashboard()">⌂ Dashboard</button>
        <button class="${active==="menu"?"sel":""}" onclick="adminMenu()">☰ Menu Management</button>
        <button class="${active==="students"?"sel":""}" onclick="adminStudents()">♙ Students</button>
        <button class="${active==="feedback"?"sel":""}" onclick="adminFeedback()">★ Feedback</button>
        <button class="${active==="wastage"?"sel":""}" onclick="adminWastage()">♻ Wastage</button>`}
      </nav>
      <div class="side-bottom"><button onclick="logout()">↪ Logout</button></div>
    </aside>
    <main class="main">
      <header class="topbar"><div><b>${data.user.role==="student"?"Student Portal":"Admin Portal"}</b><span class="muted"> / Smart Mess Management</span></div><div class="user-chip">👤 ${esc(data.user.name)}</div></header>
      ${content}
    </main>
  </div>`;
}

function render(){
  if(!data.user) return loginPage("student");
  data.user.role==="student" ? studentDashboard() : adminDashboard();
}
function logout(){ data.user=null; save(); render(); }

function studentDashboard(){
  const b=data.bookings.filter(x=>x.user===data.user.email);
  const todayBookings=b.filter(x=>x.date===today());
  const next=data.menu[new Date().getDay()===0?6:new Date().getDay()-1] || data.menu[0];
  app.innerHTML=layout(`
  <section class="page">
    <div class="welcome"><div><p class="eyebrow">STUDENT DASHBOARD</p><h1>Good morning, ${esc(data.user.name.split(" ")[0])} 👋</h1><p>Manage your meals and help reduce food waste.</p></div><div class="food-icon">🍛</div></div>
    <div class="stats">
      <div class="stat"><span>Today's bookings</span><b>${todayBookings.length}</b><small>meals booked</small></div>
      <div class="stat"><span>Weekly menu</span><b>${data.menu.length}</b><small>days available</small></div>
      <div class="stat"><span>My feedback</span><b>${data.feedback.filter(x=>x.user===data.user.email).length}</b><small>submitted</small></div>
      <div class="stat"><span>Notifications</span><b>${data.announcements.length}</b><small>updates</small></div>
    </div>
    <div class="grid two">
      <section class="card"><div class="card-title"><h2>Today's Menu</h2><button class="link-btn" onclick="studentMenu()">View all →</button></div>
        <div class="meal"><span>🌅 Breakfast</span><b>${esc(next.breakfast)}</b></div>
        <div class="meal"><span>☀️ Lunch</span><b>${esc(next.lunch)}</b></div>
        <div class="meal"><span>☕ Snacks</span><b>${esc(next.snacks)}</b></div>
        <div class="meal"><span>🌙 Dinner</span><b>${esc(next.dinner)}</b></div>
      </section>
      <section class="card"><div class="card-title"><h2>Quick Actions</h2></div>
        <div class="quick-grid">
          <button onclick="studentBookings()">✓ Book a Meal</button><button onclick="studentFeedback()">★ Give Feedback</button>
          <button onclick="studentComplaints()">⚑ Report Issue</button><button onclick="studentMenu()">☰ View Menu</button>
        </div>
      </section>
    </div>
    <section class="card"><div class="card-title"><h2>Announcements</h2></div>${data.announcements.map(a=>`<div class="announcement">🔔 ${esc(a)}</div>`).join("")}</section>
  </section>`, "dashboard");
}

function studentMenu(){
  app.innerHTML=layout(`<section class="page"><div class="section-head"><div><p class="eyebrow">MEAL PLAN</p><h1>Weekly Menu</h1></div></div>
  <div class="menu-grid">${data.menu.map((m,i)=>`<div class="menu-card"><div class="day">${esc(m.day)}</div><div><span>🌅 Breakfast</span><p>${esc(m.breakfast)}</p></div><div><span>☀️ Lunch</span><p>${esc(m.lunch)}</p></div><div><span>☕ Snacks</span><p>${esc(m.snacks)}</p></div><div><span>🌙 Dinner</span><p>${esc(m.dinner)}</p></div><button class="btn primary wide" onclick="bookDay('${esc(m.day)}')">Book Today's Meals</button></div>`).join("")}</div></section>`, "menu");
}
function bookDay(day){
  const date=today(), key=`${data.user.email}|${date}|${day}`;
  if(data.bookings.some(x=>x.key===key)){ toast("Meals already booked for today."); return; }
  data.bookings.push({key,user:data.user.email,date,day,meals:["Breakfast","Lunch","Snacks","Dinner"]});
  save(); toast("Today's meals booked successfully!"); studentBookings();
}
function studentBookings(){
  const bs=data.bookings.filter(x=>x.user===data.user.email);
  app.innerHTML=layout(`<section class="page"><div class="section-head"><div><p class="eyebrow">MEAL BOOKINGS</p><h1>My Meals</h1></div><button class="btn primary" onclick="studentMenu()">+ Book Meals</button></div>
  <section class="card"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Day</th><th>Meals</th><th>Status</th></tr></thead><tbody>${bs.length?bs.map(b=>`<tr><td>${b.date}</td><td>${esc(b.day)}</td><td>${b.meals.join(", ")}</td><td><span class="pill green">Confirmed</span></td></tr>`).join(""):`<tr><td colspan="4" class="empty">No meal bookings yet.</td></tr>`}</tbody></table></div></section></section>`,"bookings");
}
function studentFeedback(){
  app.innerHTML=layout(`<section class="page"><div class="section-head"><div><p class="eyebrow">YOUR VOICE MATTERS</p><h1>Mess Feedback</h1></div></div>
  <section class="card form-card"><form onsubmit="submitFeedback(event)">
    <label>Meal<select id="fbMeal"><option>Breakfast</option><option>Lunch</option><option>Snacks</option><option>Dinner</option></select></label>
    <label>Rating<select id="fbRating"><option value="5">★★★★★ Excellent</option><option value="4">★★★★☆ Good</option><option value="3">★★★☆☆ Average</option><option value="2">★★☆☆☆ Poor</option><option value="1">★☆☆☆☆ Very Poor</option></select></label>
    <label>Comments<textarea id="fbText" placeholder="Tell us about the food quality, taste, hygiene or service..." required></textarea></label>
    <button class="btn primary">Submit Feedback</button>
  </form></section>
  </section>`,"feedback");
}
function submitFeedback(e){e.preventDefault();data.feedback.unshift({user:data.user.email,meal:fbMeal.value,rating:Number(fbRating.value),text:fbText.value,date:today()});save();toast("Thank you for your feedback!");studentDashboard();}
function studentComplaints(){
  app.innerHTML=layout(`<section class="page"><div class="section-head"><div><p class="eyebrow">SUPPORT</p><h1>Report an Issue</h1></div></div>
  <section class="card form-card"><form onsubmit="submitComplaint(event)">
    <label>Category<select id="coCat"><option>Food Quality</option><option>Hygiene</option><option>Menu</option><option>Service</option><option>Other</option></select></label>
    <label>Issue<textarea id="coText" placeholder="Describe the issue..." required></textarea></label>
    <button class="btn primary">Submit Complaint</button>
  </form></section></section>`,"complaints");
}
function submitComplaint(e){e.preventDefault();data.complaints.unshift({user:data.user.email,category:coCat.value,text:coText.value,status:"Open",date:today()});save();toast("Complaint submitted.");studentDashboard();}

function adminDashboard(){
  const total=data.bookings.length, fb=data.feedback.length, cp=data.complaints.filter(x=>x.status==="Open").length;
  const waste=data.wastage.reduce((a,b)=>a+b.kg,0);
  app.innerHTML=layout(`<section class="page"><div class="welcome"><div><p class="eyebrow">ADMIN DASHBOARD</p><h1>Mess Overview</h1><p>Monitor meals, feedback and food wastage from one place.</p></div><div class="food-icon">📊</div></div>
  <div class="stats"><div class="stat"><span>Total meal bookings</span><b>${total}</b><small>all students</small></div><div class="stat"><span>Feedback received</span><b>${fb}</b><small>responses</small></div><div class="stat"><span>Open complaints</span><b>${cp}</b><small>need attention</small></div><div class="stat"><span>Weekly wastage</span><b>${waste}kg</b><small>recorded</small></div></div>
  <div class="grid two"><section class="card"><div class="card-title"><h2>Food Wastage</h2><button class="link-btn" onclick="adminWastage()">Manage →</button></div><div class="bars">${data.wastage.map(x=>`<div class="bar-wrap"><div class="bar" style="height:${Math.max(15,x.kg*4)}px" title="${x.kg}kg"></div><small>${x.day}</small></div>`).join("")}</div></section>
  <section class="card"><div class="card-title"><h2>Recent Feedback</h2><button class="link-btn" onclick="adminFeedback()">View all →</button></div>${data.feedback.slice(0,5).map(x=>`<div class="feedback-row"><b>${"★".repeat(x.rating)}${"☆".repeat(5-x.rating)}</b><span>${esc(x.text)}</span></div>`).join("") || '<p class="muted">No feedback yet.</p>'}</section></div>
  <section class="card"><div class="card-title"><h2>Announcements</h2><button class="btn secondary" onclick="addAnnouncement()">+ Add</button></div>${data.announcements.map((a,i)=>`<div class="announcement">${esc(a)} <button class="tiny" onclick="deleteAnnouncement(${i})">×</button></div>`).join("")}</section>
  </section>`,"dashboard");
}
function addAnnouncement(){const a=prompt("Announcement:");if(a){data.announcements.unshift(a);save();adminDashboard();}}
function deleteAnnouncement(i){data.announcements.splice(i,1);save();adminDashboard();}

function adminMenu(){
  app.innerHTML=layout(`<section class="page"><div class="section-head"><div><p class="eyebrow">ADMINISTRATION</p><h1>Menu Management</h1></div><button class="btn primary" onclick="addMenu()">+ Add Day</button></div>
  <section class="card"><div class="table-wrap"><table><thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Snacks</th><th>Dinner</th><th>Action</th></tr></thead><tbody>${data.menu.map(m=>`<tr><td><b>${esc(m.day)}</b></td><td>${esc(m.breakfast)}</td><td>${esc(m.lunch)}</td><td>${esc(m.snacks)}</td><td>${esc(m.dinner)}</td><td><button class="tiny edit" onclick="editMenu(${m.id})">Edit</button></td></tr>`).join("")}</tbody></table></div></section></section>`,"menu");
}
function addMenu(){const day=prompt("Day name:");if(!day)return;data.menu.push({id:Date.now(),day,breakfast:"To be updated",lunch:"To be updated",snacks:"To be updated",dinner:"To be updated"});save();adminMenu();}
function editMenu(id){const m=data.menu.find(x=>x.id===id);if(!m)return;const b=prompt("Breakfast:",m.breakfast);if(b===null)return;const l=prompt("Lunch:",m.lunch);const s=prompt("Snacks:",m.snacks);const d=prompt("Dinner:",m.dinner);Object.assign(m,{breakfast:b,lunch:l??m.lunch,snacks:s??m.snacks,dinner:d??m.dinner});save();adminMenu();}

function adminStudents(){
  const bookingsBy={}; data.bookings.forEach(b=>bookingsBy[b.user]=(bookingsBy[b.user]||0)+1);
  app.innerHTML=layout(`<section class="page"><div class="section-head"><div><p class="eyebrow">STUDENT MANAGEMENT</p><h1>Students</h1></div></div><section class="card"><div class="student-box"><div class="avatar">RS</div><div><h3>Rahul Sharma</h3><p class="muted">student@demo.com · CSE · Year 2</p></div><span class="pill green">Active</span></div><div class="student-box"><div class="avatar">AM</div><div><h3>Demo Student</h3><p class="muted">student2@demo.com · ECE · Year 1</p></div><span class="pill green">Active</span></div></section></section>`,"students");
}
function adminFeedback(){
  app.innerHTML=layout(`<section class="page"><div class="section-head"><div><p class="eyebrow">QUALITY MONITORING</p><h1>Student Feedback</h1></div></div><section class="card"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Student</th><th>Meal</th><th>Rating</th><th>Comment</th></tr></thead><tbody>${data.feedback.length?data.feedback.map(x=>`<tr><td>${x.date}</td><td>${esc(x.user)}</td><td>${esc(x.meal)}</td><td> ${"★".repeat(x.rating)}</td><td>${esc(x.text)}</td></tr>`).join(""):`<tr><td colspan="5" class="empty">No feedback submitted yet.</td></tr>`}</tbody></table></div></section></section>`,"feedback");
}
function adminWastage(){
  app.innerHTML=layout(`<section class="page"><div class="section-head"><div><p class="eyebrow">SUSTAINABILITY</p><h1>Food Wastage</h1></div><button class="btn primary" onclick="addWastage()">+ Add Record</button></div><section class="card"><div class="table-wrap"><table><thead><tr><th>Day</th><th>Wastage</th><th>Level</th></tr></thead><tbody>${data.wastage.map(x=>`<tr><td>${x.day}</td><td>${x.kg} kg</td><td><span class="pill ${x.kg>15?"red":x.kg>10?"yellow":"green"}">${x.kg>15?"High":x.kg>10?"Moderate":"Low"}</span></td></tr>`).join("")}</tbody></table></div></section></section>`,"wastage");
}
function addWastage(){const day=prompt("Day:");if(!day)return;const kg=Number(prompt("Wastage in kg:","10"));if(!isNaN(kg)){data.wastage.push({day,kg});save();adminWastage();}}

render();
