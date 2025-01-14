async function fetch_image(){

    // inițialitzarea cererii pentru poza de pe site
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://dog.ceo/api/breeds/image/random', true);

    // lansarea cererii


    // acest cod se va executa abia atunci când site-ul va răspunde la cererea trimisă
    xhr.onload = function(){
        display_result(this)
    }
    //xhr.addEventListener("load", display_result, xhr);
    xhr.send(null)
}

function display_result(xhr){
    console.log("done");

    // aici creez un div cu id-ul "response-wrapper", al cărui scop este să găzuiască conținutul generat în urma cererii, fie ea de succes sau nu
    // consider că acest wrapper este necesar pentru a putea elimina conținutul unei cereri anterioare indiferent de rezultat (de ex: dacă am încercat odată să preiau o imagine și a eșuat, să mi se șteargă mesajul de eroare după ce apăs iarăși butonul)
    // bazez această structură pe structurile de error handling de tip Option din limbaje precum Rust, în care atât conținutul în caz de success, precum și mesajul de eroare, sunt înglobate în aceeași structură
    
    // caut cererea anterioară și o șterg dacă există, indiferent de rezultat
    const previous_request = document.getElementById("response-wrapper");
    if(previous_request!=null){
        previous_request.remove();
    }
    
    var root = document.getElementById("image-container")
    var wrapper = document.createElement("div");
    wrapper.setAttribute("id","response-wrapper");
    root.appendChild(wrapper);

    
    if(xhr.status==200){
        console.log(xhr);
        console.log(xhr.status);

        // mai întâi inserez un element text care transmite succesul operației
        const text = "Succes! Codul cererii: "+xhr.status;
        const success_text = document.createTextNode(text);
        var success= document.createElement("p");
        success.setAttribute("class", "success-msg");
        success.appendChild(success_text);
        wrapper.appendChild(success);

        const image = document.createElement("img");
        
        // obțin URL-ul imaginii din JSON
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        //image.setAttribute("src",xhr.message);
        image.setAttribute("alt", "O imagine cu un câine obținută cu ajutorul Dog API");
        image.setAttribute("src", response.message);
        wrapper.appendChild(image);
    }else{
        console.log(xhr.status);
        // acum definesc elementul de eroare, ce va fi afișat dacă cererea nu este soluționată cu succes
        const err_text = document.createTextNode("Imaginea nu a putut fi obținută!\nCodul cererii: "+xhr.status);
        var err = document.createElement("p");
        err.setAttribute("class", "error-msg");
        err.appendChild(err_text);
        
        wrapper.appendChild(err);
    }
}

fetch_image();