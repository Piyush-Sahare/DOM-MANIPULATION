document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentList = document.getElementById('studentList');
    let students = JSON.parse(localStorage.getItem('students')) || [];

    function renderStudents() {
        studentList.innerHTML = '';
        if (students.length > 0) {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Email ID</th>
                        <th>Contact No</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            `;
            const tbody = document.createElement('tbody');
            students.forEach((student, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.id}</td>
                    <td>${student.email}</td>
                    <td>${student.contact}</td>
                    <td>
                        <button class="edit" data-index="${index}">Edit</button>
                        <button class="delete" data-index="${index}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            studentList.appendChild(table);
        } else {
            studentList.innerHTML = '<p>No students registered.</p>';
        }
    }

    function addStudent(student) {
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents();
    }

    function editStudent(index, updatedStudent) {
        students[index] = updatedStudent;
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents();
    }

    function deleteStudent(index) {
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents();
    }

    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = studentForm.studentName.value.trim();
        const id = studentForm.studentId.value.trim();
        const email = studentForm.emailId.value.trim();
        const contact = studentForm.contactNo.value.trim();

        if (name && id && email && contact) {
            addStudent({ name, id, email, contact });
            studentForm.reset();
        }
    });

    studentList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            const index = e.target.dataset.index;
            const student = students[index];
            studentForm.studentName.value = student.name;
            studentForm.studentId.value = student.id;
            studentForm.emailId.value = student.email;
            studentForm.contactNo.value = student.contact;
            studentForm.querySelector('button[type="submit"]').textContent = 'Update';
            studentForm.onsubmit = (e) => {
                e.preventDefault();
                editStudent(index, {
                    name: studentForm.studentName.value.trim(),
                    id: studentForm.studentId.value.trim(),
                    email: studentForm.emailId.value.trim(),
                    contact: studentForm.contactNo.value.trim()
                });
                studentForm.reset();
                studentForm.querySelector('button[type="submit"]').textContent = 'Register';
                studentForm.onsubmit = null;
            };
        } else if (e.target.classList.contains('delete')) {
            const index = e.target.dataset.index;
            deleteStudent(index);
        }
    });

    renderStudents();
});
