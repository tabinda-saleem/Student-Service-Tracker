document.addEventListener("DOMContentLoaded", () => {
  if (!loggedInUser || loggedInUser.role !== "admin") return;
  const page = document.body.dataset.page;
  const $ = id => document.getElementById(id);
  const esc = escapeHTML;
  const users = () => DemoStorage.get("users");
  const services = () => DemoStorage.get("services");
  const departments = () => DemoStorage.get("departments");
  const requests = () => DemoStorage.get("requests");
  const staff = () => users().filter(u => u.role === "staff");
  const btn = (label, cls, action, id) => `<button class="action-btn ${cls}" data-action="${action}" data-id="${esc(id)}">${label}</button>`;
  const empty = (cols, text) => `<tr><td colspan="${cols}" class="text-center text-secondary py-4">${text}</td></tr>`;
  function renderDashboard() {
    const us=users(), rs=requests();
    $("statUsers").textContent=us.length;
    $("statStudents").textContent=us.filter(u=>u.role==="student").length;
    $("statStaff").textContent=us.filter(u=>u.role==="staff").length;
    $("statRequests").textContent=rs.length;
    $("statCompleted").textContent=rs.filter(r=>r.status==="Completed").length;
    $("statPending").textContent=rs.filter(r=>["Pending","Submitted","Under Review"].includes(r.status)).length;
    const acts=DemoStorage.get("activity");
    $("recentActivity").innerHTML=acts.length ? acts.slice().reverse().map(a=>`<div class="activity-item"><span class="activity-dot"></span><div><p>${esc(a.message)}</p><small>${esc(a.time || "Recent")}</small></div></div>`).join("") : `<p class="text-secondary">No activity yet.</p>`;
  }
  function renderUsers() {
    const q=($("userSearch")?.value||"").toLowerCase(), role=$("roleFilter")?.value||"";
    const list=users().filter(u=>(!role||u.role===role)&&[u.name,u.email,u.department].some(v=>String(v).toLowerCase().includes(q)));
    $("usersTable").innerHTML=list.map(u=>`<tr><td class="fw-semibold">${esc(u.name)}</td><td>${esc(u.email)}</td><td class="text-capitalize">${esc(u.role)}</td><td>${esc(u.department)}</td><td><span class="badge-status ${u.status==="Inactive"?"inactive":""}">${esc(u.status||"Active")}</span></td><td>${btn("Edit","action-edit","edit-user",u.id)}${btn("Delete","action-delete","delete-user",u.id)}</td></tr>`).join("")||empty(6,"No users match your search.");
  }
  function openUser(u=null) {
    $("userForm").reset(); $("userId").value=u?.id||"";
    $("userName").value=u?.name||""; $("userEmail").value=u?.email||"";
    $("userRole").value=u?.role||"student"; $("userDepartment").value=u?.department||"";
    $("userStatus").value=u?.status||"Active"; $("userModalTitle").textContent=u?"Edit User":"Add User";
    getModal("userModal").show();
  }
  function renderServices() {
    $("servicesTable").innerHTML=services().map(s=>`<tr><td class="fw-semibold">${esc(s.name)}<div class="small text-secondary">${esc(s.description||"")}</div></td><td>${esc(s.department)}</td><td>${esc(s.processingTime)}</td><td>${esc(s.documents||"—")}</td><td>${btn("Edit","action-edit","edit-service",s.id)}${btn("Delete","action-delete","delete-service",s.id)}</td></tr>`).join("")||empty(5,"No services added yet.");
  }
  function openService(s=null) {
    $("serviceForm").reset(); $("serviceId").value=s?.id||"";
    $("serviceName").value=s?.name||""; $("serviceDepartment").value=s?.department||"";
    $("serviceDescription").value=s?.description||""; $("serviceTime").value=s?.processingTime||"";
    $("serviceDocs").value=s?.documents||""; $("serviceModalTitle").textContent=s?"Edit Service":"Add Service";
    getModal("serviceModal").show();
  }
  function renderDepartments() {
    $("departmentsTable").innerHTML=departments().map((d,i)=>`<tr><td>${i+1}</td><td class="fw-semibold">${esc(d.name)}</td><td>${btn("Edit","action-edit","edit-department",d.id)}${btn("Delete","action-delete","delete-department",d.id)}</td></tr>`).join("")||empty(3,"No departments added yet.");
  }
  function openDepartment(d=null) {
    $("departmentForm").reset(); $("departmentId").value=d?.id||"";
    $("departmentName").value=d?.name||""; $("departmentModalTitle").textContent=d?"Edit Department":"Add Department";
    getModal("departmentModal").show();
  }
  function renderAssignments() {
    const rs=requests(), ss=staff();
    $("requestSelect").innerHTML=rs.map(r=>`<option value="${esc(r.id)}">${esc(r.id)} — ${esc(r.service)} (${esc(r.status)})</option>`).join("") || `<option value="">No requests available</option>`;
    $("staffSelect").innerHTML=ss.map(s=>`<option value="${s.id}">${esc(s.name)} — ${esc(s.department)}</option>`).join("") || `<option value="">No staff available</option>`;
    $("assignmentForm").querySelector("button[type=submit]").disabled=!rs.length||!ss.length;
    $("assignmentsTable").innerHTML=rs.map(r=>{const s=ss.find(x=>Number(x.id)===Number(r.assignedStaff));return `<tr><td>${esc(r.id)}</td><td>${esc(r.service)}</td><td>${esc(r.student||"—")}</td><td>${esc(r.status)}</td><td>${esc(s?.name||"Not assigned")}</td></tr>`}).join("")||empty(5,"No requests available.");
  }
  function renderReports() {
    const rs=requests();
    $("reportTotal").textContent=rs.length;
    $("reportCompleted").textContent=rs.filter(r=>r.status==="Completed").length;
    $("reportProcessing").textContent=rs.filter(r=>r.status==="Processing").length;
    $("reportRejected").textContent=rs.filter(r=>r.status==="Rejected").length;
    const dept={}, svc={};
    rs.forEach(r=>{const d=r.department||"Unspecified"; const s=r.service||"Unspecified";dept[d]=(dept[d]||0)+1;svc[s]=(svc[s]||0)+1;});
    const rows=obj=>Object.entries(obj).map(([name,count])=>`<div class="report-row"><span>${esc(name)}</span><span class="report-count">${count}</span></div>`).join("")||`<p class="text-secondary">No data available.</p>`;
    $("departmentReport").innerHTML=rows(dept); $("serviceReport").innerHTML=rows(svc);
  }
  document.addEventListener("click", e => {
    const b=e.target.closest("[data-action]"); if(!b)return;
    const id=b.dataset.id, action=b.dataset.action;
    if(action==="edit-user") openUser(users().find(x=>String(x.id)===id));
    if(action==="delete-user" && String(loggedInUser.id)===id) showToast("You cannot delete your own account.","danger");
    else if(action==="delete-user" && confirm("Delete this user?")) {DemoStorage.set("users",users().filter(x=>String(x.id)!==id));renderUsers();showToast("User deleted.");}
    if(action==="edit-service") openService(services().find(x=>String(x.id)===id));
    if(action==="delete-service" && confirm("Delete this service?")) {DemoStorage.set("services",services().filter(x=>String(x.id)!==id));renderServices();showToast("Service deleted.");}
    if(action==="edit-department") openDepartment(departments().find(x=>String(x.id)===id));
    if(action==="delete-department" && confirm("Delete this department?")) {DemoStorage.set("departments",departments().filter(x=>String(x.id)!==id));renderDepartments();showToast("Department deleted.");}
  });
  if(page==="dashboard") renderDashboard();
  if(page==="users") {
    renderUsers(); $("addUserBtn").addEventListener("click",()=>openUser());
    $("userSearch").addEventListener("input",renderUsers); $("roleFilter").addEventListener("change",renderUsers);
    $("userForm").addEventListener("submit",e=>{
      e.preventDefault();
      const id=$("userId").value;
      const all=users();
      const email=$("userEmail").value.trim().toLowerCase();
      if(all.some(x=>x.email===email&&String(x.id)!==id)){showToast("A user with this email already exists.","danger");return;}
      const old=all.find(x=>String(x.id)===id)||{password:"1234"};
      const item=Object.assign({},old,{id:id?Number(id):DemoStorage.nextId("users"),name:$("userName").value.trim(),email:email,role:$("userRole").value,department:$("userDepartment").value.trim(),status:$("userStatus").value});
      DemoStorage.set("users",id?all.map(x=>String(x.id)===id?item:x):[...all,item]);
      getModal("userModal").hide();renderUsers();showToast("User saved.");
    });
  }
  if(page==="services") {
    renderServices(); $("addServiceBtn").addEventListener("click",()=>openService());
    $("serviceForm").addEventListener("submit",e=>{e.preventDefault();const id=$("serviceId").value;const all=services();const item={id:id?Number(id):DemoStorage.nextId("services"),name:$("serviceName").value.trim(),department:$("serviceDepartment").value.trim(),description:$("serviceDescription").value.trim(),processingTime:$("serviceTime").value.trim(),documents:$("serviceDocs").value.trim()};DemoStorage.set("services",id?all.map(x=>String(x.id)===id?item:x):[...all,item]);getModal("serviceModal").hide();renderServices();showToast("Service saved.");});
  }
  if(page==="departments") {
    renderDepartments(); $("addDepartmentBtn").addEventListener("click",()=>openDepartment());
    $("departmentForm").addEventListener("submit",e=>{e.preventDefault();const id=$("departmentId").value;const all=departments();const item={id:id?Number(id):DemoStorage.nextId("departments"),name:$("departmentName").value.trim()};DemoStorage.set("departments",id?all.map(x=>String(x.id)===id?item:x):[...all,item]);getModal("departmentModal").hide();renderDepartments();showToast("Department saved.");});
  }
  if(page==="assignments") {
    renderAssignments(); $("assignmentForm").addEventListener("submit",e=>{e.preventDefault();const requestId=$("requestSelect").value, staffId=Number($("staffSelect").value);const rs=requests().map(r=>r.id===requestId?{...r,assignedStaff:staffId}:r);DemoStorage.set("requests",rs);const selected=rs.find(r=>r.id===requestId);const acts=DemoStorage.get("activity");acts.push({message:`${requestId} assigned to ${staff().find(s=>s.id===staffId)?.name||"staff"}.`,time:"Just now"});DemoStorage.set("activity",acts);renderAssignments();showToast("Request assigned successfully.");});
  }
  if(page==="reports") {
    renderReports(); $("exportReportBtn").addEventListener("click",()=>{const rs=requests();const rows=[["Request ID","Service","Student","Department","Status","Assigned Staff"],...rs.map(r=>[r.id,r.service,r.student||"",r.department||"",r.status,(staff().find(s=>Number(s.id)===Number(r.assignedStaff))||{}).name||"Not assigned"])];const csv=rows.map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="student-service-tracker-report.csv";a.click();URL.revokeObjectURL(url);showToast("CSV report exported.");});
  }
});
