/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 转账视图
    export class PayTransferView extends ViewBase {

        inputGasCount: HTMLInputElement;
        private inputTransferAddr: HTMLInputElement;
        private divTransferAddr: HTMLDivElement;
        private labelName: HTMLLabelElement;

        private divHaveAmounts: HTMLDivElement; // 余额信息
        private divHaveGasAmounts: HTMLDivElement;  // GAS余额
        private spanHaveGasAmounts: HTMLSpanElement;    // GAS变化

        private spanBalance: HTMLSpanElement;   //余额
        private selectType: HTMLSelectElement;  //选择类型

        private netFeeCom: NetFeeComponent; // 手续费组件

        private gasBalance: string;
        private bcpBalance: string;
        private bctBalance: string;
        private toaddress: string;

        private transferType: string;   //转账类型

        static address: string = "";
        static contact: contact;

        inputCount: HTMLInputElement // 提款金额
        net_fee: string // 网络交易费

        reset() {
            this.gasBalance = '0';
            this.toaddress = "";
        }

        start() {
            this.gasBalance = Main.getStringNumber(Main.viewMgr.payView.gas);
            this.bcpBalance = Main.getStringNumber(Main.viewMgr.payView.bcp);
            this.bctBalance = Main.getStringNumber(Main.viewMgr.payView.bct);

            this.transferType = "GAS";

            super.start()

            if (!this.toaddress) {
                this.inputTransferAddr.focus()
            }
            else {
                this.inputGasCount.focus()
            }
        }

        create() {

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_popup")

            //弹窗的框
            var popupbox = this.objCreate('div')
            popupbox.classList.add("pc_popupbox", "pc_transfer")
            this.ObjAppend(this.div, popupbox)

            // 弹窗的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_popup_title")
            popupTitle.innerText = Main.langMgr.get("pay_transfer") // "转账"
            this.ObjAppend(popupbox, popupTitle)



            //转账容器
            var divtransfer = this.objCreate("div")
            divtransfer.classList.add("pc_transferbox")
            this.ObjAppend(popupbox, divtransfer)

            // 类型
            var divtransferdiv = this.objCreate("div")
            divtransferdiv.classList.add("pc_transfertype")
            this.ObjAppend(divtransfer, divtransferdiv)

            var balancetype = this.objCreate("label");
            balancetype.innerHTML = Main.langMgr.get("pay_transferType") //"转账类型：GAS  " 
            this.ObjAppend(divtransferdiv, balancetype)

            // 类型
            //var divtransfertype = this.objCreate("div")
            this.selectType = this.objCreate("select") as HTMLSelectElement
            this.selectType.classList.add("pc_transfertypes")
            this.ObjAppend(divtransferdiv, this.selectType)

            this.selectType.onchange = () => {
                this.transferType = this.selectType.value;

                switch (this.transferType) {
                    case 'BCP':
                        this.spanBalance.innerText = this.transferType + ": " + this.bcpBalance;
                        break;
                    case 'BCT':
                        this.spanBalance.innerText = this.transferType + ": " + this.bctBalance;
                        break;
                    case 'GAS':
                        this.spanBalance.innerText = this.transferType + ": " + this.gasBalance;
                        break;
                }
            }

            // 选择GAS类型
            var optionGas = this.objCreate("option") as HTMLOptionElement
            optionGas.value = Main.langMgr.get("gas") // "GAS"
            optionGas.innerHTML = Main.langMgr.get("gas")
            this.ObjAppend(this.selectType, optionGas)

            // 选择BCP类型
            var optionBcp = this.objCreate("option") as HTMLOptionElement
            optionBcp.value = Main.langMgr.get("bcp") // "BCP"
            optionBcp.innerHTML = Main.langMgr.get("bcp")
            this.ObjAppend(this.selectType, optionBcp)

            // 选择BCT类型
            var optionBct = this.objCreate("option") as HTMLOptionElement
            optionBct.value = Main.langMgr.get("bct") // "BCP"
            optionBct.innerHTML = Main.langMgr.get("bct")
            this.ObjAppend(this.selectType, optionBct)

            this.spanBalance = this.objCreate('span');
            this.spanBalance.classList.add('pc_gasbalancespan');  //添加类样式
            this.spanBalance.innerText = "GAS: " + this.gasBalance;
            this.ObjAppend(divtransferdiv, this.spanBalance);

            // 余额
            // var gasBalanceObj = this.objCreate("span");
            // gasBalanceObj.classList.add("pc_fr")
            // gasBalanceObj.textContent = Main.langMgr.get("pay_transferBalance") + this.gasBalance;
            // this.ObjAppend(divtransfertype, gasBalanceObj)


            //输入钱包地址
            this.divTransferAddr = this.objCreate("div") as HTMLDivElement
            this.divTransferAddr.classList.add("pc_transfertype")
            // divTransferAddr.innerText= Main.langMgr.get("pay_transferToAddr") //"转账地址："
            this.ObjAppend(divtransfer, this.divTransferAddr)

            //对方用户名
            this.labelName = this.objCreate("label") as HTMLLabelElement
            this.labelName.classList.add("pc_transfername")
            this.ObjAppend(this.divTransferAddr, this.labelName)

            this.inputTransferAddr = this.objCreate("input") as HTMLInputElement
            this.inputTransferAddr.classList.add("pc_transaddress")
            this.inputTransferAddr.placeholder = Main.langMgr.get("pay_transferToAddr") //"转账地址："
            this.inputTransferAddr.value = this.getAddress()
            this.inputTransferAddr.onfocus = () => {
                this.inputTransferAddr.select()
            }
            this.inputTransferAddr.onchange = () => {
                this.divTransferAddr.classList.remove("pc_transfer_active")
                this.inputTransferAddr.style.padding = "0 35px 0 5px"
                this.inputTransferAddr.style.width = "230px"
            }
            this.ObjAppend(this.divTransferAddr, this.inputTransferAddr)

            //跳到通讯录选择入口
            var aAddresbook = this.objCreate("a")
            aAddresbook.classList.add("pc_transferaddressbook", "iconfont", "icon-bc-tongxunlu")
            aAddresbook.onclick = () => {
                this.hidden()
                Main.viewMgr.payView.hidden()
                AddressbookView.select = "select"
                Main.viewMgr.change("AddressbookView")
            }
            this.ObjAppend(this.divTransferAddr, aAddresbook)


            // 转账数量
            var divGasCount = this.objCreate("div")
            divGasCount.classList.add("pc_transfertype")
            // divGasCount.innerText= Main.langMgr.get("pay_transferCount") // "转账金额："
            this.ObjAppend(divtransfer, divGasCount)

            this.inputGasCount = this.objCreate("input") as HTMLInputElement
            this.inputGasCount.placeholder = Main.langMgr.get("pay_transferCount") // "转账金额："
            this.ObjAppend(divGasCount, this.inputGasCount)
            this.inputGasCount.onkeyup = () => {
                this.doinputchange()
            }

            // 拥有GAS和SGAS数量
            this.divHaveAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveAmounts.classList.add("pc_haveamounts")
            this.ObjAppend(popupbox, this.divHaveAmounts)

            // 拥有GAS
            this.divHaveGasAmounts = this.objCreate("div") as HTMLDivElement
            this.divHaveGasAmounts.textContent = "";//Main.langMgr.get("pay_transCountGAS") + Main.getStringNumber(Main.viewMgr.payView.gas)
            this.ObjAppend(this.divHaveAmounts, this.divHaveGasAmounts)

            // GAS交易数量
            this.spanHaveGasAmounts = this.objCreate("span")
            this.ObjAppend(this.divHaveGasAmounts, this.spanHaveGasAmounts)

            // 手续费
            this.netFeeCom = new NetFeeComponent(popupbox, (net_fee) => {
                this.netFeeChange(net_fee)
            })
            this.netFeeCom.setFeeDefault()
            this.netFeeCom.createDiv()



            // 弹窗按钮外框
            var popupbutbox = this.objCreate('div')
            popupbutbox.classList.add("pc_popupbutbox")
            this.ObjAppend(popupbox, popupbutbox)

            // 取消
            var popupClose = this.objCreate('button')
            popupClose.classList.add("pc_cancel")
            popupClose.textContent = Main.langMgr.get("cancel") // "取消"
            popupClose.onclick = () => {
                this.remove(300)
            }
            this.ObjAppend(popupbutbox, popupClose)

            // 转账确认
            var transferObj = this.objCreate("button")
            transferObj.textContent = Main.langMgr.get("ok") // "确认"
            transferObj.onclick = () => {
                this.doTransfer()   //gas转账
            }
            this.ObjAppend(popupbutbox, transferObj)

        }

        toRefer() {
            if (PayTransferView.refer) {
                Main.viewMgr.change(PayTransferView.refer)
                PayTransferView.refer = null;
            }
        }

        private getAddress() {
            if (PayTransferView.address) {
                this.toaddress = PayTransferView.address
                PayTransferView.address = ""
            }
            return this.toaddress
        }


        private doinputchange() {
            if (!Main.viewMgr.payView.checkTransCount(this.inputGasCount.value)) {
                this.spanHaveGasAmounts.textContent = ""
                return
            }
            //this.divHaveGasAmounts.classList.add("pc_expenditure")
            //this.spanHaveGasAmounts.textContent = "";// Main.getStringNumber(floatNum.plus(Number(this.inputGasCount.value), Number(this.net_fee)));
        }

        gatSelect() {
            this.divTransferAddr.classList.add("pc_transfer_active")
            this.labelName.textContent = PayTransferView.contact.address_name + ":"
            this.inputTransferAddr.value = PayTransferView.contact.address_wallet

            var labelNameW = this.labelName.clientWidth + 10;
            var inputTransferAddrw = 270 - labelNameW - 35;

            this.inputTransferAddr.style.width = inputTransferAddrw + "px"
            this.inputTransferAddr.style.padding = "0 35px 0 " + labelNameW + "px"
            if (this.labelName) {
                this.inputGasCount.focus()
            }
        }

        private async doTransfer() {
            var wallet_res = await Main.validateFormat("walletaddr", this.inputTransferAddr)
            if (wallet_res === false) {
                return
            }
            else if (wallet_res !== true) {
                this.toaddress = wallet_res
            }
            else {
                this.toaddress = this.inputTransferAddr.value;
            }

            if (!Main.viewMgr.payView.checkTransCount(this.inputGasCount.value)) {
                Main.showErrMsg("pay_transferCountError", () => {
                    this.inputGasCount.focus()
                })
                return;
            }

            // 手续费
            var net_fee = this.net_fee

            // 余额判断
            switch (this.transferType) {
                case 'GAS':
                    //gas转账
                    if (Number(this.inputGasCount.value) + Number(net_fee) > Number(this.gasBalance)) {
                        Main.showErrMsg("pay_transferGasNotEnough", () => {
                            this.inputGasCount.focus()
                        })
                        return
                    }
                    break;
                case 'BCP': //BCP转账
                    if ( Number(net_fee) > Number(this.gasBalance)) {
                        Main.showErrMsg("pay_transferGasNotEnough", () => {
                            this.inputGasCount.focus()
                        })
                        return
                    }
                    if (Number(this.inputGasCount.value) > Number(this.bcpBalance)) {
                        Main.showErrMsg("pay_transferBCPNotEnough", () => {
                            this.inputGasCount.focus()
                        })
                        return
                    }
                    break;
                case 'BCT': //BCT转账
                    if ( Number(net_fee) > Number(this.gasBalance)) {
                        Main.showErrMsg("pay_transferGasNotEnough", () => {
                            this.inputGasCount.focus()
                        })
                        return
                    }
                    if (Number(this.inputGasCount.value) > Number(this.bctBalance)) {
                        Main.showErrMsg("pay_transferBCTNotEnough", () => {
                            this.inputGasCount.focus()
                        })
                        return
                    }
                    break;
            }

            

            Main.viewMgr.change("ViewLoading")
            var api_type: string;

            try {
                switch (this.transferType) {
                    case 'GAS':
                        //gas转账
                        var res: Result = await tools.CoinTool.rawTransaction(this.toaddress, tools.CoinTool.id_GAS, this.inputGasCount.value, Neo.Fixed8.fromNumber(Number(net_fee)));
                        api_type = "6"
                        break;
                    case 'BCP': //BCP转账
                        var res: Result = await tools.CoinTool.nep5Transaction(Main.user.info.wallet, this.toaddress, tools.CoinTool.id_BCP, this.inputGasCount.value, net_fee);
                        api_type = "7"
                        break;
                    case 'BCT': //BCT转账
                        var res: Result = await tools.CoinTool.nep5Transaction(Main.user.info.wallet, this.toaddress, tools.CoinTool.id_BCT, this.inputGasCount.value, net_fee);
                        api_type = "8"
                        break;
                }
            }
            catch (e) {
                var res = new Result()
                res.err = true;
                res.info = e.toString();

                console.log("[BlaCat]", '[PayTransferView]', 'doTransfer, tools.CoinTool.rawTransaction error => ', e.toString())
            }


            Main.viewMgr.viewLoading.remove()

            if (res) {
                console.log("[BlaCat]", '[PayTransferView]', 'gas转账结果 => ', res)
                if (res.err == false) {
                    // 成功，上报
                    await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        res.info,
                        "0",
                        this.inputGasCount.value,
                        api_type,
                        '{"sbPushString":"transfer", "toaddr":"' + this.toaddress + '", "count": "' + this.inputGasCount.value + '"}',
                        Main.netMgr.type,
                        "0",
                        net_fee,
                    );

                    // "转账操作成功"
                    Main.showInfo(("pay_transferDoSucc"))

                    this.remove();
                    if (PayTransferView.callback) PayTransferView.callback();
                    PayTransferView.callback = null;
                }
                else {
                    // 转账失败
                    Main.showErrMsg(("pay_transferDoFail"))
                }
            }
            else {
                Main.showErrMsg(("pay_transferDoFail"))
            }
        }

        private netFeeChange(net_fee) {
            this.net_fee = net_fee

            var v = this.inputGasCount.value;
            // 没有输入值，返回
            if (v.length == 0 || v.replace(/(^s*)|(s*$)/g, "").length == 0) {
                return
            }
            // 修改GAS值
            this.spanHaveGasAmounts.textContent = Main.getStringNumber(floatNum.plus(Number(v), Number(this.net_fee)));
        }

        updateBalance() {
            // gas
            this.divHaveGasAmounts.textContent = "";//Main.langMgr.get("pay_transCountGAS") + Main.getStringNumber(Main.viewMgr.payView.gas)
        }

    }
}