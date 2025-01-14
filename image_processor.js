
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
    
    //console.log(wrapper);
    //console.log(typeof(wrapper));
    root.appendChild(wrapper);

    if(typeof(image_id)!=null){
        // conform cerinței, aici am pus un timeout de 1 secundă
        setTimeout(async ()=>{
            const times_list = await process_image(image_id);
            setTimeout(()=>{
                //console.log(times_list);
                //console.log("Înainte de add_timers")
                add_timers(times_list,wrapper);
                //console.log("după add_timers")
            },4000)
            
        }, 1000)
        //process_image(image_id);
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
        //console.log(data);

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
            
            //console.log("test");
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
    const cv = document.getElementById("canvas");
    var ctx = cv.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    var times_list = [];

    img.addEventListener("load", async () => {

        // redimensionez canvas-ul astfel încât să încapă imaginea în el
        cv.width = img.width;
        cv.height = img.height;

        // acest pas realizează înversarea orizontală a imaginii date
        ctx.translate(cv.width,0);
        ctx.scale(-1,1);
        ctx.drawImage(img, 0, 0);

        var times_list = [];
        /*
        const imageData = ctx.getImageData(0,0,img.width, img.height);
        const newImageData = await apply_filter(imageData,sharpen_matrix);
        ctx.putImageData(newImageData,0,0)
        */
        
        const wrapper = document.getElementById("response-wrapper");


        // aici iau cu un rând și o coloană în plus pentru calcul, și apoi afișez fără acel rând, resp. acea coloană
        // aici trebuie ca fiecare timeout să aibă o valoare diferită deoarece funcțiile anonime sunt asincrone, deci temporizatoarele sunt pornite aproape simultan
        setTimeout(async ()=>{
            const first_quarter = ctx.getImageData(0,0,((img.width/2)<<0)+1, ((img.height/2)<<0)+1)
            //pt cronometrare
            const filter_start = performance.now();
            const new_first_quarter = await apply_filter(first_quarter,sharpen_matrix);
            const filter_end = performance.now();
            ctx.putImageData(new_first_quarter,0,0,0,0,(img.width/2)<<0,(img.height/2)<<0);
            console.log("qt. 1 done");

            const time_diff = filter_end-filter_start;
            const new_time  = document.createElement("p");
            new_time.innerHTML = `Timpul de procesare pentru cadranul #1: ${time_diff}ms`
            wrapper.appendChild(new_time);
            
        },1000)
        
        setTimeout(async ()=>{
            const second_quarter = ctx.getImageData(((img.width/2)<<0),0,((img.width/2)<<0), ((img.height/2)<<0)+1)
            const filter_start = performance.now();
            const new_second_quarter = await apply_filter(second_quarter,sharpen_matrix);
            const filter_end = performance.now();
            ctx.putImageData(new_second_quarter,(img.width/2)<<0,0,0,0,(img.width/2)<<0,(img.height/2)<<0);
            console.log("qt. 2 done");

            const time_diff = filter_end-filter_start;
            const new_time  = document.createElement("p");
            new_time.innerHTML = `Timpul de procesare pentru cadranul #2: ${time_diff}ms`
            wrapper.appendChild(new_time);
        },2000)
        
        setTimeout(async ()=>{
            const third_quarter = ctx.getImageData(0,((img.height/2)<<0),((img.width/2)<<0)+1, ((img.height/2)<<0))
            const filter_start = performance.now();
            const new_third_quarter = await apply_filter(third_quarter,sharpen_matrix);
            const filter_end = performance.now();
            ctx.putImageData(new_third_quarter,0,((img.height/2)<<0),0,0,(img.width/2)<<0,(img.height/2)<<0);
            console.log("qt. 3 done");

            const time_diff = filter_end-filter_start;
            const new_time  = document.createElement("p");
            new_time.innerHTML = `Timpul de procesare pentru cadranul #3: ${time_diff}ms`
            wrapper.appendChild(new_time);
        },3000)
        
        setTimeout(async () => {
            const fourth_quarter = ctx.getImageData(((img.width/2)<<0),((img.height/2)<<0),((img.width/2)<<0), ((img.height/2)<<0))
            const filter_start = performance.now();
            const new_fourth_quarter = await apply_filter(fourth_quarter,sharpen_matrix);
            const filter_end = performance.now();

            ctx.putImageData(new_fourth_quarter,((img.width/2)<<0),((img.height/2)<<0),0,0,(img.width/2)<<0,(img.height/2)<<0);  
            console.log("qt. 4 done");

            const time_diff = filter_end-filter_start;
            const new_time  = document.createElement("p");
            new_time.innerHTML = `Timpul de procesare pentru cadranul #4: ${time_diff}ms`
            wrapper.appendChild(new_time);
        }, 4000);
        
        console.log(times_list);
        console.log("done (teoretic)")
        
    });
    
    img.src = img_url;
   
    // matricea de convoluție care produce ”ascuțirea” imaginii
    const sharpen_matrix = [[0, -1, 0],
                            [-1, 5, -1],
                            [0, -1, 0]];

    return times_list;
}



function apply_filter(image_data, filter_matrix){
    //console.log("input:");
    //console.log(image_data);
    var width = image_data.width
    var height = image_data.height
    image_data = image_data.data

    var new_image_data = new ImageData( width, height )

    // aici o să fie mereu 3x3
    const filter_size = 3;
    // filter_center - poziția în care se află centrul filtrului (aici o să fie 1 pt filtre 3x3)
    var filter_center = ( filter_matrix.length / 2 ) << 0 // << 0 teoretic înmulțește rezultatul împărțirii cu 2^0; scopul este trunchierea părții fracționare
    //console.log(filter_center);
    // gi reprezintă iteratorul pt fiecare element al array-ului dat
    for ( var gi = 0; gi < image_data.length; gi++ ) {
      var go = ( gi % 4 ) // 0 - roșu, 1 - verde, 2 - albastru, 3 - canalul alfa (care rămâne neschimbat)
      var pi = ( gi / 4 ) << 0  // pixelul imaginii în sine 
      // sar peste valoarea pentru alfa
      if ( go === 3 ) {
        //console.log(imageData[gi])
        new_image_data.data[ gi ] = image_data[ gi ]
        continue
      }

      // din poziția lui pi în vector deduc coordonatele xi, yi ale acestuia
      // operațiile astea trebuie făcute din cauza faptului că matricea imaginii e aici transformată în pixeli
      var iY = ( pi / width ) << 0
      var iX = ( pi % width )
      var new_grade = 0;

      // iterez după linii
      for ( var fY = 0; fY < filter_size; fY++ ) {
        
        // găsește poziția pixelului cu care trebuie făcută convoluția; dacă pixelul se află peste marginile imaginii, este adus în int. marginilor
        var gY = iY + fY - filter_center; 
        gY = gY < 0 ? 0 : ( gY >= height ? height - 1 : gY )
        
        // iterez după coloană
        for ( var fX = 0; fX < filter_size; fX++ ) {
            // idem
            var gX = iX + fX - filter_center;
            gX = gX < 0 ? 0 : ( gX >= width ? width - 1 : gX )
            
            // MULT SUBPIXEL WITH THE FILTER WEIGHT
            // AND SUM THE RESULT

            // argumentul lui imagewidth corelează poziția pixelului din imaginea reală cu indexul acestuia pt culoarea pt care se face procesarea în mom. actual
            new_grade += image_data[ gY * width * 4 + gX * 4 + go ]
            * filter_matrix[ fY ][ fX ]
        }
      }
      new_image_data.data[ gi ] = new_grade;
    }

    return new_image_data
}


function add_timers(timers_list, wrapper){
    const timer_show = document.createElement("div");
    for(i in timers_list){
        timer_show.innerHTML+=`<p> Timpul de procesare pentru cadranul #${i+1}: ${timers_list[i]}</p>`;
    }
    //console.log(timer_show);
    wrapper.appendChild(timer_show);
}

// aici a trebuit să stabilesc un timeout pt a permite elementului root al paginii să se încarce mai întâi
// pun un apel de get_image direct în script pentru a căuta și procesa automat o imagine odată cu încărcarea paginii
get_image();
