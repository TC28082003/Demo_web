// Sélectionner l'élément input
const file = document.getElementById('csvfile');

// Attacher un événement de changement
file.addEventListener("change", prend_fichier);
let rows = [];

// Fonction pour lire le fichier CSV
function prend_fichier(event) {
    const fichier = event.target.files[0]; // Récupérer le fichier sélectionné
    if (fichier) {
        const lire = new FileReader();
        lire.onload = function (e) {
            const content = e.target.result;
            affichage_colonnes(content); // Appeler affichage avec le contenu du fichier
        };
        lire.readAsText(fichier);
    } else {
        console.error("Aucun fichier sélectionné");
    }
}

// Fonction pour afficher le contenu sous forme de tableau
function affichage_colonnes(contenu) {
    const lines = contenu.split("\n"); //Divise en lignes
    if (lines.length === 0) return;
    rows = [];

    for (let i = 0; i < lines.length; i++) {
        let lignes_i = lines[i].split(","); // Séparer les colonnes par ","
        rows.push(lignes_i);
    }

    let checkboxes = "<fieldset>";
    checkboxes += "  <legend>Choisissez les colonnes </legend>"
    for (let j = 0; j < rows[0].length; j++) {
        checkboxes += `<input type="checkbox" class="colSelect" id = "${j}" value="${j}">`;
        checkboxes += `<label for = "${j}"> ${rows[0][j].trim()} </label>`; 
    }
    checkboxes += "</fieldset> <br>"; // **Correction : fermeture correcte de la ligne**
    document.getElementById("table").innerHTML = checkboxes;
    document.getElementById("table").innerHTML += `<button onclick="afficherTableau()">Afficher</button>`;
    document.getElementById("table").innerHTML += `<button onclick="similarity.js">Similarity</button>`;

}


// Fonction d'exportation CSV
function export_en_CSV() {
    let csvContent = "";
    for (let i = 0; i < rows.length; i++) {
        let rowData = [];
        for (let j = 0; j < rows[i].length; j++) {
            rowData.push(rows[i][j]);
        }
        csvContent += rowData.join(",") + "\n";
    }

    let blob = new Blob([csvContent], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exported_data1.csv";    
    link.click();
}

function afficherTableau() {
    let selectedCols = Array.from(document.querySelectorAll('input.colSelect:checked')).map(input => parseInt(input.value));
    
    if (selectedCols.length === 0) {
        alert("Veuillez sélectionner au moins une colonne !");
        return;
    }

    // Ouvrir une nouvelle fenêtre
    let newTab = window.open("", "_blank");
    if (!newTab) {
        alert("Veuillez autoriser les pop-ups pour voir le tableau !");
        return;
    }

    let newDocument = newTab.document;
    newDocument.write("<html><head><title>Des colonnes selection</title>");
    newDocument.write(`<style>
        body {font-family: 'Poppins', sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; text-align: center; }
        table { border-collapse: collapse; width: 80%; margin: auto; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #007bff; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        button{height: 50px; width: 30%; color:rgb(255, 127, 127); margin: 0px; text-align: center; padding: 1%; background-color: aqua; Border-radius: 60px; Border: 1px dashed #999;}
        .table-container { max-height: 70%; overflow-y: auto; Border-radius: 60px; Border: 1px dashed #999;}
    </style>`);
    newDocument.write("</head><body>");
    newDocument.write("<h2>Tableau Filtré</h2>");
    
    let table = "<div class='table-container'><table><thead><tr>";
    //Faire des colonnes en tete
    selectedCols.forEach(colIndex => {
        table += `<th>${rows[0][colIndex].trim()}</th>`;
    });
    table += "</tr></thead><tbody>";

    // Des valeurs pour chaque colonnes
    for (let i = 1; i < rows.length; i++) {
        table += "<tr>";
        selectedCols.forEach(colIndex => {
            table += `<td>${rows[i][colIndex].trim()}</td>`;
        });
        table += "</tr>";
    }
    
    table += "</tbody></table></div><br><br>";
        // Ajouter la fonction export_en_CSV() dans la nouvelle fenêtre
        newDocument.write(`<script>
            function export_en_CSV() {
                let csvContent = "";
                let table = document.querySelector("table");
                let rows = table.querySelectorAll("tr");
    
                rows.forEach(row => {
                    let rowData = [];
                    row.querySelectorAll("th, td").forEach(cell => rowData.push(cell.innerText));
                    csvContent += rowData.join(",") + "\\n";
                });
    
                let blob = new Blob([csvContent], { type: "text/csv" });
                let link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "exported_data.csv";    
                link.click();
            }
        </script>`);
    table += `<br><br><button onclick="export_en_CSV()">Sauvegarder CSV</button>`;

    newDocument.write(table);
    newDocument.write("</body></html>");
    newDocument.close();
}


