<?php
// Daten von AJAX-Anfrage empfangen
$data = json_decode(file_get_contents("php://input"));


$filename = '';
if ( isset($data->filename) ) { $filename = $data->filename; }
if ( isset($_GET['file']) && ($_GET['file'] != '' ) ){ $filename = $_GET['file']; }

// Datei öffnen oder erstellen
if($filename != ''){
    //verhindert das aufrufen von daten ausserhalb des unterordners oder ver versuche andere dateitypen zu erzeugen
    $wirte_data = true;
    if( strpos($filename, '.') !== false ){ $wirte_data = false; }
    if( strpos($filename, ':') !== false ){ $wirte_data = false; }
    if( strpos($filename, '_a') !== false ){ $wirte_data = false; }
    if( strpos($filename, 'gameKey') !== false ){ $wirte_data = false; }
    
    
    if($wirte_data){
        $file = "./maps/" . $filename . ".json";
        
        
        if (!file_exists($file)) {
            fopen($file, "w");
        }
    
        // Daten in Datei schreiben
        $json_data = json_encode($data);
        file_put_contents($file, $json_data);
        
        
        echo "Json erfolgreich erstellt!";
    }else{
        echo "Dateiname ungültig!";
    }
    
}else{
    echo "Dateiname unbekannt!";
}

?>