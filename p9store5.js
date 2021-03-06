const Business = 'treasurer@pack9.com';
const ReturnURL = '';

//function VerifyName(form) {
function VerifyName(item) {
    var valid = true
    var form = document.getElementById(item);

    if (document.Scout.name.value == "" || document.Scout.den.value == "") {
       valid = false;
       alert("You must enter your Scout's full name and den number for " +
             "payments to be processed correctly.");
    } else {
//        form.os0.value = document.Scout.name.value + ", Den " + 
//                         document.Scout.den.value;
 
        PAYPAL.apps.MiniCart.addToCart({"business":      form.business.value,
                                        "item_name":     form.item_name.value,
                                        "amount":        form.amount.value,
                                        "currency_code": form.currency_code.value,
                                        "quantity":      form.quantity.value,
                                        "on0":           form.on0.value,
                                        "os0": document.Scout.name.value + 
                                               ", Den " + document.Scout.den.value,
                                        "on1":           form.on1.value,
                                        "os1":           form.os1.value,
                                       });
        valid = false;
    }
    return valid;
}



var debugDiv = document.getElementById('debugdiv');
var debugtxt = [];

function debug(text) {
  debugtxt.push(text);
  debugDiv.innerHTML = debugtxt.join('<br>');
}

//debug("version 5.12");

function loadVisualizationAPI() { 
  google.load("visualization", "1");
  google.setOnLoadCallback(sendQuery);
}

function sendQuery() {
  
  var prefs = new gadgets.Prefs();
  var denurl = prefs.getString("_den_url");
  var invurl = prefs.getString("_inventory_url");
  var invrefresh = prefs.getInt("_inventory_refresh_interval");
  
  var denquery = new google.visualization.Query(denurl);
  denquery.setRefreshInterval(0);
  denquery.send(fillDens);
  
  var invquery = new google.visualization.Query(invurl);
  invquery.setRefreshInterval(invrefresh);
  invquery.send(fillInventory);

}


function fillDens(response) {

  if (response.isError()) {
    alert('Error in query');
  }

  var data = response.getDataTable();
  var denSelect = document.getElementById('denselect');
  var html = [];   // start the HTML output string

  const Number = 0;
  const Rank   = 1;
 
//  html.push('<option value="">choose...</option>\n');
  var opt = document.createElement('option');
  opt.value = "";
  opt.innerHTML = "choose...";
  denSelect.appendChild(opt);
  
  for (var row = 0; row < data.getNumberOfRows(); row++) {
    var num = escapeHtml(data.getFormattedValue(row, Number));
    var rank = escapeHtml(data.getFormattedValue(row, Rank));
    
//    html.push('<option value="' + num + '">' + num + ' - ' + rank + '</option>\n');
    opt = document.createElement('option');
    opt.value = num;
    opt.innerHTML = num + ' - ' + rank; 
    denSelect.appendChild(opt);

  }

  
  //  denSelect.innerHTML = html.join('');

}


function fillInventory(response) {

  if (response.isError()) {
    alert('Error in query');
  }

  /**
   * GET THE DATA FROM THE SPREADSHEET - sorry to scream in caps, 
   * but this is a key step
   */
  var data = response.getDataTable();

  var html = [];   // start the HTML output string

  const Sku     = 0;
  const Title   = 1;
  const Price   = 2;
  const Descr   = 3;
  const Multi   = 4;
  const OptName = 5;
  const Options = 6; 

  /**
   * Process all Rows in the specified range
   */
  for (var row = 0; row < data.getNumberOfRows(); row++) {
      var sku = escapeHtml(data.getFormattedValue(row, Sku));
      var title = escapeHtml(data.getFormattedValue(row, Title));
      var price = escapeHtml(data.getFormattedValue(row, Price));
      var descr = escapeHtml(data.getFormattedValue(row, Descr));
      var multi = escapeHtml(data.getFormattedValue(row, Multi));
      var optName = escapeHtml(data.getFormattedValue(row, OptName));
      var options = escapeHtml(data.getFormattedValue(row, Options));

      html.push('<form name="form' + row + '" target="paypal" ' +
                'id="item' + row + '" ' +
                'method="post" onsubmit="return VerifyName(this)" ' +
                'style="margin: 0px">\n');
      html.push('<input type="hidden" name="cmd" value="_cart">\n');
      html.push('<input type="hidden" name="business" value="' + Business + 
                '">\n');
      html.push('<input type="hidden" name="item_name" value="' + title + 
                '">\n');
      html.push('<input type="hidden" name="custom" value="">\n');
      html.push('<input type="hidden" name="return" value="' + ReturnURL + 
                '">\n');
      html.push('<input type="hidden" name="no_note" value="1">\n');
      html.push('<input type="hidden" name="currency_code" value="USD">\n');
      html.push('<input type="hidden" name="quantity" value="1">\n');
      html.push('<input type="hidden" name="add" value="1">\n');
      html.push('<input type="hidden" name="amount" value="' + price + '">\n');
      html.push('<input type="hidden" name="on0" value="For">\n');
      html.push('<input type="hidden" name="os0">\n');

//      if (optName != '') {
          html.push('<input type="hidden" name="on1" value="' + optName +
                    '">\n');
//      }

      html.push('<div class="table-row">\n');
      html.push('<div class="cell11">' + title + '</div>\n');

      html.push('<div class="cell13">');
      if (optName != '') {
          html.push(optName + ': <select name="os1">');
          var opts = options.split(',');
          for (var opt in opts) {
              html.push('<option value="' + opts[opt] + '">' + opts[opt] + 
                        '</option>');
          }
          html.push('</select>');
      } else {
//          html.push('&nbsp;');
          html.push('<input type="hidden" name="os1" value="">\n');
      }
      html.push('</div>\n');

      html.push('<div class="cell14">');
      if (multi != '') {
          html.push('Qty: <input name="quantity" value="1" size="2" ' + 
                    'maxlength="2">\n');
      } else {
          html.push('&nbsp;');
      }
      html.push('</div>\n');

      html.push('<div class="cell15">$' + price + '</div>\n');
      //html.push('<div class="cell16"><input src="https://www.paypal.com/en_US/i/btn/btn_cart_SM.gif" alt="Add to cart" name="submit" border="0" type="image"></div>\n');
      html.push('<div class="cell16"><input src="https://www.paypal.com/en_US/i/btn/btn_cart_SM.gif" alt="Add to cart" name="Add to cart" border="0" type="image" onclick="return VerifyName(\'item' + row + '\')"></div>\n');
      html.push('<div class="tr-end"></div>\n');
      html.push('</div>');
      html.push('<div class="table-row">\n');
      html.push('<div class="cell21">&nbsp;</div>\n');
      html.push('<div class="cell22">' + descr + '</div>\n');
      html.push('<div class="cell26">&nbsp;</div>\n');
      html.push('<div class="tr-end">&nbsp;<hr class="sep">&nbsp;</div>\n');
      html.push('</div>');

      html.push('</form>\n\n');
    
  } 


  // Set the generated html into the container div.

  var tableDiv = document.getElementById('tablediv');
  tableDiv.innerHTML = html.join('');

  gadgets.window.adjustHeight();
  
}

function escapeHtml(str) {
  if (str == null) {
    return '';
  }
  //str = str.replace(//g, ">");
  //str = str.replace(/"/g, "\"").replace(/'/g, "'");
  return str;
} 



