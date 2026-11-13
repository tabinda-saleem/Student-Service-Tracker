const DemoStorage = (() => {
  const defaults = {
    services: [
      {id:1,name:"Transcript Request",department:"Examination",description:"Request an academic transcript.",processingTime:"3-5 Days",documents:"Student ID, application form"},
      {id:2,name:"Bonafide Certificate",department:"Student Affairs",description:"Request a bonafide certificate.",processingTime:"2-3 Days",documents:"Student ID"},
      {id:3,name:"ID Card Request",department:"Student Affairs",description:"Apply for a student ID card.",processingTime:"2-4 Days",documents:"Photo, student ID"},
      {id:4,name:"Degree Verification",department:"Examination",description:"Verify a degree record.",processingTime:"5-7 Days",documents:"Degree copy"}
    ],
    departments: [
      {id:1,name:"Examination"},
      {id:2,name:"Student Affairs"},
      {id:3,name:"Computer System Engineering"},
      {id:4,name:"Electrical Engineering"},
      {id:5,name:"Mechanical Engineering"}
    ],
    requests: [
      {id:"REQ-2026-1001",service:"Transcript Request",student:"Ayma Azhar",department:"Examination",status:"Under Review",assignedStaff:2},
      {id:"REQ-2026-1002",service:"Bonafide Certificate",student:"Sarah Khan",department:"Student Affairs",status:"Processing",assignedStaff:null},
      {id:"REQ-2026-1003",service:"ID Card Request",student:"Ayma Azhar",department:"Student Affairs",status:"Completed",assignedStaff:2},
      {id:"REQ-2026-1004",service:"Degree Verification",student:"Sarah Khan",department:"Examination",status:"Pending",assignedStaff:null}
    ],
    activity: [
      {message:"Request REQ-2026-1001 is waiting for staff review.",time:"Demo activity"},
      {message:"Bonafide Certificate request is being processed.",time:"Demo activity"},
      {message:"ID Card Request has been completed.",time:"Demo activity"}
    ]
  };
  function get(key) {
    const name = key === "users" ? "users" : "sst_" + key;
    const stored = localStorage.getItem(name);
    if (stored !== null) { try { return JSON.parse(stored); } catch (e) {} }
    localStorage.setItem(name, JSON.stringify(defaults[key] || []));
    return structuredClone(defaults[key] || []);
  }
  function set(key, value) { localStorage.setItem(key === "users" ? "users" : "sst_" + key, JSON.stringify(value)); }
  function nextId(key) { return get(key).reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1; }
  return { get, set, nextId };
})();
