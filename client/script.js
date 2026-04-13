const studentlist = document.getElementById("studentlist");
const form = document.getElementById("studentForm");

const API_URL = "/students";

async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        const students = await response.json();

        studentlist.innerHTML = "";
        students.forEach(student => {
            const li = document.createElement("li");
            li.textContent = `${student.name} (Age: ${student.age})`;
            studentlist.appendChild(li);
        }); 
    } catch (error) {
        console.error("Error fetching students:", error);
    }   

}
fetchStudents();

new FormData(form).addEventListener("submit", async (e) => {    }
)
