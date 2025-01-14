
async function get_image(){
    
    // practic, aici aștept ca cererea să fie procesată și să fie gata div-ul wrapper înainte să continui execuția programului
    var [wrapper,image_id] = await handle_request();
    
    // am pus explicit comanda asta după await; altfel, căuta div-ul respectiv înainte să se poată încărca în pagină
    var root = document.getElementById("image-container")
    
    // caut cererea anterioară și o șterg dacă există, indiferent de rezultat
    const previous_request = document.getElementById("response-wrapper");
    if(previous_request!=null){
        previous_request.remove();
    }
    
    console.log(wrapper);
    console.log(typeof(wrapper));
    root.appendChild(wrapper);

    if(typeof(image_id)!=null){
        process_image(image_id);
    }
}

async function handle_request(){

    const wrapper = document.createElement("div");
    wrapper.setAttribute("id","response-wrapper");
    try{
       
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        // verific dacă cererea a fost efectuată cu success
        // dacă nu, trimit o eroare cu codul HTTP al răsp eronat
        console.log(response);
        if(!response.ok){
            console.log(response);
            throw new Error(response.status);
        }else{
        const data = await response.json();
        console.log(data);

        const success_msg = document.createElement("div");
        success_msg.setAttribute("class", "success-msg");
        
        var success_msg_content = "";
        for (const key in data){
            success_msg_content += `<p> ${key}: ${data[key]}</p>`;
        }
        success_msg.innerHTML = success_msg_content;
        wrapper.appendChild(success_msg);
        wrapper.innerHTML += `<img src="${data.message}"><br>`;
        wrapper.innerHTML += `<canvas id="canvas"></canvas>`;
        
        // procesarea imaginii o voi face într-o funcție separată
        //process_image(data.message);
        return [wrapper, data.message]
    }
    }catch(error){
        // mai întâi declar elementul care îmi va afișa eroarea, ca apoi să inserez și textul

        const err = document.createElement("p");
        err.setAttribute("class", "error-msg");
        
        // aici pot avea loc 2 tipuri de erori: fie cererea nu a putut fi transmisă deloc (network error), fie a putut fi transmisă și nu a putut fi soluționată de server (eroarea pe care o arunc eu în interiorul if-ului)
        // dacă valoarea returnată poate fi transformată în număr, atunci suntem în cazul 2, și afișez și status-ul HTTP
        // dacă nu, atunci e eroare de rețea și afișez un mesaj ca atare
        
        if(isNaN(Number(error))){
            
            console.log("test");
            var err_text = document.createTextNode("Eroare de rețea! Cererea nu a putut fi transmisă!");
        }else{
            console.log(Number(error));
            console.log(Number(error)==="NaN");
            var err_text = document.createTextNode("Imaginea nu a putut fi obținută! Codul cererii: "+error);
        }
        err.appendChild(err_text);
        wrapper.append(err);

        return [wrapper, null];
    }

}



async function process_image(img_url){
    const ctx = document.getElementById("canvas").getContext("2d");
    const img = new Image();
    
    img.addEventListener("load", () => {
      ctx.drawImage(img, 0, 0);
    });
    
    img.src = img_url;
    
}

// aici a trebuit să stabilesc un timeout pt a permite elementului root al paginii să se încarce mai întâi
get_image();
