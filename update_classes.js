const fs = require('fs');

function updateFile(path) {
    let html = fs.readFileSync(path, 'utf8');

    // Replace specific button classes
    html = html.replace(/class="btn btn-secondary btn-sm"/g, 'class="btn-custom btn-secondary btn-sm"');
    html = html.replace(/class="btn btn-sm btn-secondary"/g, 'class="btn-custom btn-secondary btn-sm"');
    html = html.replace(/class="btn btn-secondary"/g, 'class="btn-custom btn-secondary"');
    html = html.replace(/class="btn btn-sm delete-btn"/g, 'class="btn-custom btn-danger btn-sm"');
    html = html.replace(/class="btn delete-btn"/g, 'class="btn-custom btn-danger"');
    html = html.replace(/class="btn btn-sm"/g, 'class="btn-custom btn-primary btn-sm"');
    html = html.replace(/class="btn"/g, 'class="btn-custom btn-primary"');
    
    // Sometimes there are other classes combined with btn, for safety in restaurant-list:
    // e.g. class="btn delete-btn" was already caught above.

    // Cards
    html = html.replace(/class="card/g, 'class="card-custom');

    // Inputs
    html = html.replace(/<input([^>]*)>/gi, (match, g1) => {
        if (g1.includes('type="checkbox"')) {
            if (g1.includes('class="')) {
                return `<input${g1.replace(/class="/, 'class="checkbox-custom ')}>`;
            }
            return `<input class="checkbox-custom"${g1}>`;
        } else {
            if (g1.includes('class="')) {
                return `<input${g1.replace(/class="/, 'class="input-custom ')}>`;
            }
            return `<input class="input-custom"${g1}>`;
        }
    });

    // Selects
    html = html.replace(/<select([^>]*)>/gi, (match, g1) => {
        if (g1.includes('class="')) {
            return `<select${g1.replace(/class="/, 'class="select-custom ')}>`;
        }
        return `<select class="select-custom"${g1}>`;
    });

    fs.writeFileSync(path, html);
    console.log(path + ' updated');
}

updateFile('src/app/customer-list/customer-list.html');
updateFile('src/app/restaurant-list/restaurant-list.html');
