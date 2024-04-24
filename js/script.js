function clearFields() {
    document.getElementById('priority').value = '';
    document.getElementById('retry').value = '';
    document.getElementById('schedule_at').value = '';
    document.getElementById('csvFile').value = '';
    document.getElementById('queueId').value = '';
}

function convertToJson() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    const priorityInput = document.getElementById('priority').value;
    const retryInput = document.getElementById('retry').value;
    const scheduleAtInput = document.getElementById('schedule_at').value;
    const reader = new FileReader();

    reader.onload = function(e) {
        const lines = e.target.result.split('\n');
        const jsonData = [];

        for (let i = 1; i < lines.length; i++) {
            const data = lines[i].trim().split(';');
            const toObjects = [];

            // Verificar os campos de telefone (telefone1 a telefone5)
            for (let j = 3; j <= 7; j++) {
                if (data[j]) {
                    const toObject = {
                        "id": `${i}_${j - 2}`,
                        "number": data[j]
                    };
                    toObjects.push(toObject);
                }
            }

            const obj = {
                "id": data[0],
                "schedule_at": scheduleAtInput,
                "priority": priorityInput,
                "retry": retryInput,
                "contact_name": data[2],
                "to": toObjects,
                "contact_data": {
                    "titulo": data[1]
                }
            };

            jsonData.push(obj);
        }

        downloadJsonFile(jsonData, file.name.replace('.csv', '_convertido.json'));
    };

    reader.readAsText(file);
    clearFields();
}

function downloadJsonFile(data, filename) {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
    
}

function postData() {
    const customer = document.getElementById('customer').value;
    const queueId = document.getElementById('queueId').value;
    const token = document.getElementById('token').value;
    const priorityInput = document.getElementById('priority').value;
    const retryInput = document.getElementById('retry').value;
    const scheduleAtInput = document.getElementById('schedule_at').value;
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function(e) {
        const lines = e.target.result.split('\n');
        const jsonData = [];

        for (let i = 1; i < lines.length; i++) {
            const data = lines[i].trim().split(';');
            const toObjects = [];

            // Verificar os campos de telefone (telefone1 a telefone5)
            for (let j = 3; j <= 7; j++) {
                if (data[j]) {
                    const toObject = {
                        "id": `${i}_${j - 2}`,
                        "number": data[j]
                    };
                    toObjects.push(toObject);
                }
            }

            const obj = {
                "id": data[0],
                "schedule_at": scheduleAtInput,
                "priority": priorityInput,
                "retry": retryInput,
                "contact_name": data[2],
                "to": toObjects,
                "contact_data": {
                    "titulo": data[1]
                }
            };

            jsonData.push(obj);
        }

        // Fazer requisição POST com os dados JSON para a API
        const url = `https://${customer}.api.vonixcc.com.br/v1/contacts/${queueId}`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (response.ok) {
                alert("Mailing alimentado com sucesso");
            } else {
                throw new Error(`Erro ao enviar requisição: ${response.status} - ${response.statusText}`);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    reader.readAsText(file);
    clearFields();
}
