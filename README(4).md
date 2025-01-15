# Aplicație Web pentru Procesarea Imaginilor în Timp Real

## 1. Descrierea Aplicației Cerute

### 1.1 Obiective
Dezvoltarea unei aplicații web care să permită:
- Preluarea imaginilor de la un API extern
- Aplicarea unui filtru de *smoothing* în timp real
- Măsurarea și afișarea performanței procesării
- Procesarea secvențială a imaginii pe cadrane

> + Cadranul 1 : stânga sus
> + Cadranul 2 : dreapta sus
> + Cadranul 3 : stânga jos
> + Cadranul 4 : dreapta jos


### 1.2 Cerințe Funcționale
- Interfață web accesibilă și intuitivă
- Procesare asincronă a imaginilor
- Afișarea timpilor de procesare pentru fiecare operație
- Suport pentru diferite filtre de procesare
- Gestionarea erorilor de rețea și procesare

## 2. Partea Teoretică

### 2.1 Procesarea Digitală a Imaginilor
Procesarea digitală a imaginilor reprezintă manipularea imaginilor digitale prin intermediul algoritmilor computerizați. O imagine digitală este reprezentată ca o matrice bidimensională de pixeli, unde fiecare pixel conține informații despre culoare în format RGB (Red, Green, Blue).

### 2.2 Filtre de Convoluție
Filtrele de convoluție sunt operații matematice fundamentale în procesarea imaginilor. Acestea implică:
- Aplicarea unei matrice de convoluție (kernel) peste imagine
- Calculul unei sume ponderate a pixelilor învecinați
- Generarea unei noi valori pentru pixelul central

#### 2.2.1 Box Blur (Blur Uniform)
```javascript
const box_matrix = [
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9]
];
```

### 2.3 Canvas HTML5
Canvas HTML5 oferă un context de randare pentru grafică 2D, permițând:
- Manipularea directă a pixelilor
- Operații de transformare geometrică
- Gestionarea eficientă a datelor de imagine

## 3. Descrierea Implementării

### 3.1 Arhitectura Aplicației
Aplicația este structurată în trei componente principale:
1. Frontend (HTML + CSS)
2. *Nucleul* de procesare (JavaScript)
3. Comunicare cu API-ul extern

### 3.2 Tehnologii Utilizate
- HTML5 Canvas pentru manipularea imaginilor
- JavaScript ES6+ pentru logica aplicației
- CSS3 pentru stilizare
- API Fetch pentru comunicare HTTP
- Async/Await pentru operații asincrone
- Canvas API

## 4. Descrierea Funcțională a Aplicației

### 4.1 Fluxul de Lucru
1. Utilizatorul inițiază procesarea prin apăsarea butonului
2. Aplicația preia o imagine aleatorie de la API
3. Imaginea este afișată în interfață
4. Procesarea începe secvențial pe cadrane
5. Rezultatele sunt afișate în timp real

### 4.2 Interfața Utilizator
- Buton pentru inițierea procesării
- Zonă de afișare pentru imaginea originală
- Zonă de afișare pentru imaginea procesată
- Secțiune pentru afișarea statisticilor de procesare

### 4.3 Gestionarea Erorilor
- Erori de rețea
- Erori de procesare
- Validarea datelor de intrare

## 5. Descrierea Modulelor (`image_processor.js`)
Funcții principale:
- `get_image()`: Inițierea procesului
- `handle_request()`: Gestionarea cererilor HTTP
- `process_image()`: Procesarea imaginii
- `apply_filter()`: Aplicarea filtrelor
- `add_timers()`: Gestionarea statisticilor

## 6. Concluzii și Dezvoltări Ulterioare

### 6.1 Realizări
- Implementarea cu succes a procesării asincrone și secvențiale
- Sistem robust de gestionare a erorilor

### 6.2 Limitări Actuale
- Dependență de conexiunea la internet
- Limitări ale performanței pentru imagini mari

### 6.3 Dezvoltări Viitoare
- Adăugarea mai multor tipuri de filtre
- Optimizarea algoritmilor de procesare

## 7. Bibliografie

1.  Wikipedia. (2024). *Box blur*.
    https://en.wikipedia.org/wiki/Box_blur

