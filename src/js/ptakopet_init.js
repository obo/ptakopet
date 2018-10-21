// This is the bootstrap ptakopět script.
// Including this script should be enough for Ptakopět
// to run.
// Since jQuery is loaded only after floater.html
// is added to DOM, we have to use basic JS toolset.
// Due to separate contexts (content/background),
// we cannot wait for jQuery to load.

// add this: to make ptakopet work on your webpage
// <script id='ptakopet_init' src='path/to/ptakopet/js/ptakopet_init.js'></script>

// Ptakopět already loaded from other source
if(typeof(PTAKOPET_INIT_LOADED) == 'undefined') {
    var PTAKOPET_INIT_LOADED = true;
    // chrome supports chrome only
    // IE supports browser only
    // Firefox & Opera support both
    // could be possibly done with ||, but this is safer
    var browser = (typeof(browser) !== 'undefined') ? browser : 
                  (typeof(chrome)  !== 'undefined') ? chrome  : {};
    let is_extension = (Object.keys(browser).length != 0 && typeof browser.extension != "undefined");
    let getURL = is_extension ?
        browser.runtime.getURL :
        function(s) { 
            // dev/ptakopet/js/ptakopet_init.js -> ptakopet_init
            let p = document.getElementById('ptakopet_init').src.replace('ptakopet_init.js','');
            return p+s;
        };
    console.log("is extension");
    console.log(is_extension);


    // store current extension url in html dom, but hide it
    // easier than firing events through different contexts
    let base_url_span = document.createElement("span");
    base_url_span.id = "ptakopet_base_url_span";
    base_url_span.style.display = "none";
    base_url_span.style.fontSize = 0;
    base_url_span.innerHTML = getURL("");
    document.body.appendChild(base_url_span);

    // fetch floater.html content
    let floater_req = new XMLHttpRequest();
    floater_req.open("GET", getURL("../html/floater.html"));
    floater_req.addEventListener("load", 
        function(data) {
            if(floater_req.status != 200) 
                alert("Something went wrong with Ptakopět (loading floater.html)");
            else {
                let text = floater_req.responseText;
                document.body.innerHTML += text;

                // scripts
                let script_objs = document.getElementsByClassName("extension_url_script");
                // HTMLCollection doesn't have a nice iterator
                for(var i = 0; i < script_objs.length; i++) {
                    // spend 2 hours on this - there is no prettier way
                    let item = script_objs.item(i);
                    let item_new = document.createElement("script");
                    
                    item_new.src = item.getAttribute('p_src_late') == 'true' ? item.getAttribute("p_src") : getURL(item.getAttribute("p_src"));
                    document.body.appendChild(item_new);
                }
                for(var i = 0; i < script_objs.length; i++) {
                    script_objs.item(i).remove();
                }

                // images
                let img_objs = document.getElementsByClassName("extension_url_img");
                for(var i = 0; i < img_objs.length; i++) {
                    let item = img_objs.item(i);
                    item.setAttribute("src", getURL(item.getAttribute("p_src")));
                }

                // styles
                let style_objs = document.getElementsByClassName("extension_url_style");
                for(var i = 0; i < style_objs.length; i++) {
                    let item = style_objs.item(i);
                    item.setAttribute("href", getURL(item.getAttribute("p_href")));
                }

            }
        });


    floater_req.send();
}