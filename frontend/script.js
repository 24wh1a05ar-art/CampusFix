const API_URL = "https://campusfix-ijod.onrender.com";

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const userId = user.id;


async function reportIssue() {

    const title =
        document.getElementById("title").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const category =
        document.getElementById("category").value;

    const location =
        document.getElementById("location").value.trim();

    const priority =
        document.getElementById("priority").value;

    const message =
        document.getElementById("message");


    if (!title || !description || !category || !location) {

        message.textContent =
            "Please fill all required fields.";

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/api/issues`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    title,
                    description,
                    category,
                    location,
                    priority
                })
            }
        );


        const data =
            await response.json();


        if (response.ok) {

            message.textContent =
                "Issue reported successfully!";


            document.getElementById("title").value = "";

            document.getElementById("description").value = "";

            document.getElementById("category").value = "";

            document.getElementById("location").value = "";

            document.getElementById("priority").value = "Medium";


            loadIssues();

        } else {

            message.textContent =
                data.message ||
                "Failed to report issue.";

        }

    } catch (error) {

        console.log("Report error:", error);

        message.textContent =
            "Unable to connect to server.";
    }
}


async function loadIssues() {

    try {

        const response = await fetch(
            `${API_URL}/api/issues/my/${userId}`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const issues =
            await response.json();


        if (!response.ok) {

            console.log(
                "Failed to load issues:",
                issues
            );

            return;
        }


        updateStats(issues);

        displayIssues(issues);


    } catch (error) {

        console.log(
            "Failed to load issues:",
            error
        );
    }
}


function updateStats(issues) {

    document.getElementById("totalIssues").textContent =
        issues.length;


    document.getElementById("pendingIssues").textContent =
        issues.filter(
            issue => issue.status === "Pending"
        ).length;


    document.getElementById("progressIssues").textContent =
        issues.filter(
            issue => issue.status === "In Progress"
        ).length;


    document.getElementById("resolvedIssues").textContent =
        issues.filter(
            issue => issue.status === "Resolved"
        ).length;
}

function displayIssues(issues) {

    const issuesContainer =
        document.getElementById("issues");

    issuesContainer.innerHTML = "";

    if (issues.length === 0) {

        issuesContainer.innerHTML = `
            <div class="issue">
                <h3>No issues reported yet</h3>
                <p>
                    If you notice a campus problem,
                    report it using the form above.
                </p>
            </div>
        `;

        return;
    }

    issues.forEach(issue => {

        const div =
            document.createElement("div");

        div.className = "issue";

        const date =
            new Date(issue.createdAt).toLocaleString();

        let statusClass = "";

        if (issue.status === "Pending") {
            statusClass = "status-pending";
        } else if (issue.status === "In Progress") {
            statusClass = "status-progress";
        } else if (issue.status === "Resolved") {
            statusClass = "status-resolved";
        } else {
            statusClass = "status-rejected";
        }

        let priorityClass = "";

        if (issue.priority === "High") {
            priorityClass = "priority-high";
        } else if (issue.priority === "Medium") {
            priorityClass = "priority-medium";
        } else {
            priorityClass = "priority-low";
        }

        div.innerHTML = `

            <div class="issue-header">

                <div>

                    <h3>${issue.title}</h3>

                    <span class="issue-id">
                        Issue ID: ${issue._id}
                    </span>

                </div>

                <span class="badge ${statusClass}">
                    ${issue.status}
                </span>

            </div>

            <p>
                ${issue.description}
            </p>

            <p>
                <strong>Category:</strong>
                ${issue.category}
            </p>

            <p>
                <strong>Location:</strong>
                ${issue.location}
            </p>

            <p>
                <strong>Priority:</strong>

                <span class="badge ${priorityClass}">
                    ${issue.priority}
                </span>
            </p>

            <p>
                <strong>Reported:</strong>
                ${date}
            </p>

        `;

        issuesContainer.appendChild(div);

    });
}

window.reportIssue = reportIssue;

loadIssues();