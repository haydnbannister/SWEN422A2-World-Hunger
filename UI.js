    // write your d3 code here.. 
    
    // python -m http.server 8000
    // python -m SimpleHTTPServer 8000
    // http://localhost:8000/rivalries.html            
    
    //comment
  
 var historySettings = [];      
 var index = -1;
 var current_mode = "pop";
            
 
 var ui_selection = [];
 
 
            $(document).ready(function () {
                make_slider('2000');
            });
            
        
        
        function plot(filename){
            d3.csv(filename, function(data) {
            
                return filterRows(data)
                
            
            });
        }
        
        var year = $('#slider-input').val();      
        plot("Data/"+year + ".csv");
        create_buttons("Data/"+year + ".csv");
        make_record();
        
    function filterRows(data){

            var validTuples = [];
            
            var settings = historySettings[index];
                 
                //Get validTuples
            for (var i = 0; i < data.length; i++) {
                var tuple = data[i];
                
                if(settings[1].includes(tuple.Country)){
                    validTuples.push(tuple);
                }else if(settings[2].includes(tuple["Continent Name"])){
                    validTuples.push(tuple);
                }
                
            }
            
            return validTuples;
    
        } 
    

    

    
    function make_slider(input_year){
       // console.log("making slider: "+ input_year);
        var mySlider = $("#slider-input").slider({
                    min:2000,
                    max: 2015,
                    value:parseInt(input_year),
                    step:1
                }).on('slideStop', function(ev){
                    var year = parseInt(input_year);
                    plot("Data/"+year + ".csv");
                    create_buttons("Data/"+year + ".csv");
                    make_record();
                    loadData();
                });//.on('change', function(ev){
                    //var year = parseInt(input_year);
                    //plot("Data/"+year + ".csv");
                    //create_buttons("Data/"+year + ".csv");
                //loadData();
                //});;
        
        
    }
    
    function create_buttons(filename){
        d3.csv(filename, function(data) {
            
            //var states = get_selected_states();
            //var conts = get_selected_conts();
            
            var states = []
            var conts = []
            
            if(index >= 0){
                //console.log("loading current settings");
                states = historySettings[index][1];
                conts = historySettings[index][2];
            }
            
            country_labels = []
            continent_labels = []
            
            var dropdown = document.getElementById("country_buttons");
            dropdown.innerHTML = '';
            
            var dropdown = document.getElementById("continent_buttons");
            dropdown.innerHTML = '';
            
            for (var i = 0; i < data.length; i++) {
                country_labels.push(data[i].Country);
                if(!continent_labels.includes(data[i]["Continent Name"])){
                    continent_labels.push(data[i]["Continent Name"]);
                }
                
            }
            
            
            for (var i = 0; i < country_labels.length; i++){
                var label = document.createElement("div");
                label.innerHTML = data[i].Country;
                var element = document.createElement("input");
                element.setAttribute("type", "checkbox");
                element.setAttribute("name", country_labels[i]);
                element.setAttribute("float", "right");
                element.setAttribute("onclick", "checkbox_event(\""+country_labels[i]+"\")");
                if(states.includes(country_labels[i])){
                    element.setAttribute("checked", "true");
                }
                label.appendChild(element);
                var dropdown = document.getElementById("country_buttons");
                dropdown.appendChild(label);
            }
            
            for (var i = 0; i < continent_labels.length; i++){
                var cont_label = document.createElement("div");
                cont_label.innerHTML = continent_labels[i];
                
                var element = document.createElement("input");
                element.setAttribute("type", "checkbox");
                element.setAttribute("name", continent_labels[i]);
                element.setAttribute("float", "right");
                element.setAttribute("onclick", "checkbox_event(\""+continent_labels[i]+"\")");
                if(conts.includes(continent_labels[i])){
                    element.setAttribute("checked", "true");
                }
                cont_label.appendChild(element);
                
                var dropdown = document.getElementById("continent_buttons");
                dropdown.appendChild(cont_label);
            }
            
        });
        
        
    }
    
    function checkbox_event(){
        
       // console.log("Checkbox Event");
        make_record();
        plot("Data/"+$('#slider-input').val()+ ".csv");
        redraw_buttons();
    }
    
    
    function get_selected_states(){
        var dropdown = document.getElementById("country_buttons").childNodes;
        var selected_states = []

        
        for (var i = 0; i < dropdown.length; i++){
            checkbox = dropdown[i].childNodes[1];
            if(typeof checkbox !== "undefined" && checkbox.checked){
                selected_states.push(checkbox.name);
            }
        }
        
        return selected_states;
    }
    
    function get_selected_conts(){
        var cont_dropdown = document.getElementById("continent_buttons").childNodes;
        var selected_conts = []
        
        
        for (var i = 0; i < cont_dropdown.length; i++){
            checkbox = cont_dropdown[i].childNodes[1];
            if(typeof checkbox !== "undefined" && checkbox.checked){
                selected_conts.push(checkbox.name);
            }
        }
        
        return selected_conts;
        
    }
    
    function redraw_buttons(){
        record = historySettings[index];
        //console.log("Year is: " + record[0]);
        create_buttons("Data/"+ record[0] + ".csv");   
        //document.getElementById("slider-input").value = record[0];
        //slider = document.getElementById("slider-input").slider('value',50);
        //console.log("output " + slider.value);
       // console.log(record[0] + " is what it is set to " );
        $("#slider-input").slider("setValue", record[0]);
        //var slider = document.getElementById("slider-input");
        //var keys = Object.keys(slider);
        //console.log("Keys " + keys);
        //make_slider(record[0]);
        loadData();
    }
    
    function undo(){
        if(index > 0){
            index = index - 1;
            //console.log("undoing");
            redraw_buttons();
        }
        
    }
    
    function redo(){
        if(index < historySettings.length - 1){
            index = index + 1;
            //console.log("redoing");
            redraw_buttons();
        }
       
    }
    
    function make_record(){
        
        var year =  $('#slider-input').val();
        
        var states = get_selected_states();
        var conts = get_selected_conts();
        
        if(index == -1){
           // console.log("Setting Conts");
            conts = ["North America", "Europe", "Africa", "South America", "Asia"];   
        }
        
        var record = new Array (year, states, conts, current_mode);
        
        var new_history = [];
        for(var i = 0; i <= index; i++){
            new_history[i] = historySettings[i];
        }
        historySettings = new_history;
        
        historySettings.push(record);
        index = index + 1;
        //console.log("Length of history " + historySettings.length);
        

       // console.log(historySettings[2]);
        
        
    }
    
    function changeMode(label){
     
        mode = get_current_mode();
        
        if(label != mode){
            current_mode = label;
            
            if(label == "percent"){
                
                var button = document.getElementById("percent_button");
                button.setAttribute("class","btn btn-primary");
                
                button = document.getElementById("pop_button");
                button.setAttribute("class","btn btn-default");
                
            }else{
                
                var button = document.getElementById("percent_button");
                button.setAttribute("class","btn btn-default");
                
                button = document.getElementById("pop_button");
                button.setAttribute("class","btn btn-primary");
                
            }
            
            
            make_record();
            redraw_buttons();
        }
        
    }
    
    function get_current_mode(){
     
        return historySettings[index][3];
        
        
    }
        
    function download(){
        d3.csv('Data/'+ $("#slider-input").val() +'.csv', function(error, data) {
            
            var filename = "data.csv";
            
            var data = filterRows(data);
            r = ""; 
            r += "Country Name,";
            
            if(get_current_mode() == "percent"){
                    r += "Hunger (%),";
                }else{
                    r += "Hunger (Millions of People),";
                }
            r += "Continent Name";
            r += '\n';
            
            for(var i = 0; i < data.length; i++){
                var row = Object.keys(data[i]);
                //console.log(row);
                
                 
                r += data[i].Country;
                r += ",";
                
                if(get_current_mode() == "percent"){
                    r += data[i].Percent;
                    r += ",";
                }else{
                    r += data[i].Millions;
                    r += ",";
                }
                
                
                r += data[i]["Continent Name"];

                    
                
                
                r += '\n';
                
            }

            link = document.createElement('a');
            link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(r));
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        });
    }

    function make_selection(id){
        
        
         d3.csv('Data/'+ $("#slider-input").val() +'.csv', function(error, data) {
            
             for(var i = 0; i < data.length; i++){
                    
                 if(id == ("ID"+data[i]["iso3"]) || id == ("HUNID"+data[i]["iso3"])){
                  
                    console.log("Selecting " + data[i].Country);
                    
                    new_select = {Country: data[i].Country, id: data[i]["iso3"]}
                    ui_selection.push(new_select);
                    
                     
                 }
                 
             }
             

        });
         
         
    }
    
    
    function is_selected(id){
        
        for(var i = 0; i < ui_selection.length; i++){
            
                
            
        }
        
    }

        
