async function main_input_giftcode(sleep_interval_millsec) {
  
  var defaultIds = "117446202"
  var giftcode = prompt("Input GiftCode")
  var members = prompt("Input Account IDs", defaultIds).split(/[,\s\r\n]/).filter(v => v != "")
  
  var result_summary = ""
  
  for (let i=0; i<members.length; ++i) {
    var res_msg = await input_giftcode(members[i], giftcode)
    
    if (res_msg == "交換コードがありません") break
    if (res_msg.startsWith("交換成功です。"))
      result_summary += `\n${members[i]}\t${giftcode}\tOK`
    else if (res_msg.startsWith("この報酬は受取済です。"))
      result_summary += `\n${members[i]}\t${giftcode}\tAlready`
    else
      result_summary += `\n${members[i]}\t${giftcode}\tNG\t${res_msg}`

    await sleep(sleep_interval_millsec)
  }
  
  prompt("実行結果", result_summary)
}

async function input_giftcode(id, giftcode, sleep_interval_millsec) {
  const SELECTOR_EXIT_BTN = "#app > div > div > div.exchange_container > div.main_content > div.roleInfo_con > div.exit_con > div"
  const SELECTOR_CHARA_ID_INPUT = "#app > div > div > div.exchange_container > div.main_content > div.roleId_con > div.roleId_con_top > div.input_wrap > input[type=text]"
  const SELECTOR_LOGIN_BTN = "#app > div > div > div.exchange_container > div.main_content > div.roleId_con > div.roleId_con_top > div.btn.login_btn > span"
  const SELECTOR_GIFTCODE_INPUT = "#app > div > div > div.exchange_container > div.main_content > div.code_con > div.input_wrap > input[type=text]"
  const SELECTOR_EXCHANGE_BTN = "#app > div > div > div.exchange_container > div.main_content > div.btn.exchange_btn"
  const SELECTOR_POPUP_MESSAGE = "#app > div > div.message_modal > div.modal_content > p"
  const SELECTOR_POPUP_CONFIRM_BTN = "#app > div > div.message_modal > div.modal_content > div.confirm_btn"


  if (null != document.querySelector(SELECTOR_EXIT_BTN)) {
    document.querySelector(SELECTOR_EXIT_BTN).click()
  }

  while (null == document.querySelector(SELECTOR_CHARA_ID_INPUT)) { await sleep(100) }
  document.querySelector(SELECTOR_CHARA_ID_INPUT).value = id;
  document.querySelector(SELECTOR_CHARA_ID_INPUT).dispatchEvent(new Event("input"));
  document.querySelector(SELECTOR_LOGIN_BTN).click();

  while (null == document.querySelector(SELECTOR_EXIT_BTN)) { await sleep(100) } // wait for login

  while (null == document.querySelector(SELECTOR_GIFTCODE_INPUT)) { await sleep(100) }
  document.querySelector(SELECTOR_GIFTCODE_INPUT).value = giftcode;
  document.querySelector(SELECTOR_GIFTCODE_INPUT).dispatchEvent(new Event("input"));
  
  await sleep(100)
  document.querySelector(SELECTOR_EXCHANGE_BTN).click()
  await sleep(500)
  
  while (null == document.querySelector(SELECTOR_POPUP_CONFIRM_BTN)) { await sleep(500) }
  var confirm_msg = document.querySelector(SELECTOR_POPUP_MESSAGE).innerText
  await sleep(1000)
    
  document.querySelector(SELECTOR_POPUP_CONFIRM_BTN).click()
  return confirm_msg
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (document.URL == 'https://wos-giftcode.centurygame.com/') {
  main_input_giftcode(1000)
} else {
  alert("Gift Code Center ページを開いてからブックマークを呼び出してください。")
}
