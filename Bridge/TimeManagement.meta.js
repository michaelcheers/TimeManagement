Bridge.assembly("TimeManagement", function ($asm, globals) {
    "use strict";


    var $m = Bridge.setMetadata,
        $n = ["System","System.Collections.Generic","TimeManagement"];
    $m("TimeManagement.Extensions", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"Add","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"nodes","ip":true,"pt":System.Array.type(System.Object),"ps":1}],"tpc":1,"tprm":["T"],"sn":"Add","rt":System.Object,"p":[System.Object,System.Array.type(System.Object)]},{"a":2,"n":"AddCamelSpace","is":true,"t":8,"pi":[{"n":"str","pt":$n[0].String,"ps":0}],"sn":"AddCamelSpace","rt":$n[0].String,"p":[$n[0].String]},{"a":2,"n":"AddDiv","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"nodes","ip":true,"pt":System.Array.type(System.Object),"ps":1}],"tpc":1,"tprm":["T"],"sn":"AddDiv","rt":System.Object,"p":[System.Object,System.Array.type(System.Object)]},{"a":2,"n":"AddElement","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"nodes","ip":true,"pt":System.Array.type(System.Object),"ps":1}],"tpc":1,"tprm":["T"],"sn":"AddElement","rt":System.Object,"p":[System.Object,System.Array.type(System.Object)]},{"a":2,"n":"AddEnum","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0},{"n":"defaultValue","dv":null,"o":true,"pt":$n[0].Nullable$1(System.Object),"ps":1},{"n":"defaultValueString","dv":"","o":true,"pt":$n[0].String,"ps":2}],"tpc":1,"tprm":["T"],"sn":"AddEnum","rt":HTMLSelectElement,"p":[HTMLSelectElement,$n[0].Nullable$1(System.Object),$n[0].String]},{"a":2,"n":"AddTo","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"containingElem","pt":Node,"ps":1}],"tpc":1,"def":function (T, element, containingElem) { return ((e, c) => c.appendChild(e))(element, containingElem); },"rt":System.Object,"p":[System.Object,Node]},{"a":2,"n":"AddToBody","is":true,"t":8,"pi":[{"n":"n","pt":System.Object,"ps":0}],"tpc":1,"tprm":["T"],"sn":"AddToBody","rt":System.Object,"p":[System.Object]},{"a":2,"n":"AddUl","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"nodes","ip":true,"pt":System.Array.type(System.Object),"ps":1}],"tpc":1,"tprm":["T"],"sn":"AddUl","rt":System.Object,"p":[System.Object,System.Array.type(System.Object)]},{"a":2,"n":"AppendChild","is":true,"t":8,"pi":[{"n":"node","pt":Node,"ps":0},{"n":"element","pt":System.Object,"ps":1}],"tpc":1,"def":function (T, node, element) { return node.appendChild(element); },"rt":System.Object,"p":[Node,System.Object]},{"a":2,"n":"Hide","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0}],"tpc":1,"def":function (T, element) { return (e => (e.style.display = 'none', e))(element); },"rt":System.Object,"p":[System.Object]},{"a":2,"n":"JoinBR","is":true,"t":8,"pi":[{"n":"strings","pt":$n[1].IEnumerable$1(System.String),"ps":0}],"sn":"JoinBR","rt":System.Array.type(System.Object),"p":[$n[1].IEnumerable$1(System.String)]},{"a":2,"n":"SetCustomValidity","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"message","pt":$n[0].String,"ps":1}],"tpc":1,"def":function (T, element, message) { return (e => (e.setCustomValidity(message), e.reportValidity(), e))(element); },"rt":System.Object,"p":[System.Object,$n[0].String]},{"a":2,"n":"SetDataList","is":true,"t":8,"pi":[{"n":"element","pt":HTMLInputElement,"ps":0},{"n":"datalistID","pt":$n[0].String,"ps":1}],"tpc":0,"def":function (element, datalistID) { return (e => (e.setAttribute('list', datalistID), e))(element); },"rt":HTMLInputElement,"p":[HTMLInputElement,$n[0].String]},{"a":2,"n":"SetValue","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0},{"n":"value","pt":System.Object,"ps":1}],"tpc":1,"tprm":["T"],"sn":"SetValue","rt":HTMLSelectElement,"p":[HTMLSelectElement,System.Object]},{"a":2,"n":"Show","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0}],"tpc":1,"def":function (T, element) { return (e => (e.style.display = '', e))(element); },"rt":System.Object,"p":[System.Object]},{"a":2,"n":"ToCamelString","is":true,"t":8,"pi":[{"n":"e","pt":System.Object,"ps":0}],"tpc":1,"tprm":["T"],"sn":"ToCamelString","rt":$n[0].String,"p":[System.Object]},{"a":2,"n":"ToTimeString","is":true,"t":8,"pi":[{"n":"time","pt":$n[0].TimeSpan,"ps":0}],"sn":"ToTimeString","rt":$n[0].String,"p":[$n[0].TimeSpan]},{"a":2,"n":"Value","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0}],"tpc":1,"tprm":["T"],"sn":"Value","rt":$n[0].Nullable$1(System.Object),"p":[HTMLSelectElement]},{"a":2,"n":"WrapDiv","is":true,"t":8,"pi":[{"n":"element","pt":Node,"ps":0}],"tpc":0,"def":function (element) { return (div => (div.appendChild(element), div))(document.createElement('div')); },"rt":HTMLDivElement,"p":[Node]},{"a":2,"n":"WrapLi","is":true,"t":8,"pi":[{"n":"element","pt":Node,"ps":0}],"tpc":0,"def":function (element) { return (li => (li.appendChild(element), li))(document.createElement('li')); },"rt":HTMLLIElement,"p":[Node]}]}; }, $n);
    $m("TimeManagement.Enumerable", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"Append","is":true,"t":8,"pi":[{"n":"arr","pt":$n[1].IEnumerable$1(System.Object),"ps":0},{"n":"value","pt":System.Object,"ps":1}],"tpc":1,"tprm":["T"],"sn":"Append","rt":System.Array.type(System.Object),"p":[$n[1].IEnumerable$1(System.Object),System.Object]},{"a":2,"n":"Prepend","is":true,"t":8,"pi":[{"n":"arr","pt":$n[1].IEnumerable$1(System.Object),"ps":0},{"n":"value","pt":System.Object,"ps":1}],"tpc":1,"tprm":["T"],"sn":"Prepend","rt":$n[1].IEnumerable$1(System.Object),"p":[$n[1].IEnumerable$1(System.Object),System.Object]},{"a":2,"n":"Zip","is":true,"t":8,"pi":[{"n":"e_a","pt":$n[1].IEnumerable$1(System.Object),"ps":0},{"n":"e_b","pt":$n[1].IEnumerable$1(System.Object),"ps":1}],"tpc":2,"tprm":["T","T2"],"sn":"Zip","rt":$n[1].IEnumerable$1(System.ValueTuple$2(System.Object,System.Object)),"p":[$n[1].IEnumerable$1(System.Object),$n[1].IEnumerable$1(System.Object)]}]}; }, $n);
    $m("TimeManagement.Timer", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[HTMLDivElement],"pi":[{"n":"slot","dv":null,"o":true,"pt":HTMLDivElement,"ps":0}],"sn":"ctor"},{"a":2,"n":"Rerender","t":8,"sn":"Rerender","rt":$n[0].Void},{"a":2,"n":"Update","t":8,"sn":"Update","rt":$n[0].Void},{"a":2,"n":"IsPaused","t":16,"rt":$n[0].Boolean,"g":{"a":2,"n":"get_IsPaused","t":8,"rt":$n[0].Boolean,"fg":"IsPaused","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsPaused"},{"a":2,"n":"TimeElapsed","t":16,"rt":$n[0].TimeSpan,"g":{"a":2,"n":"get_TimeElapsed","t":8,"rt":$n[0].TimeSpan,"fg":"TimeElapsed"},"fn":"TimeElapsed"},{"a":2,"n":"TimeElapsedString","t":16,"rt":$n[0].String,"g":{"a":2,"n":"get_TimeElapsedString","t":8,"rt":$n[0].String,"fg":"TimeElapsedString"},"fn":"TimeElapsedString"},{"a":2,"n":"Element","t":4,"rt":HTMLDivElement,"sn":"Element"},{"a":2,"n":"btn","t":4,"rt":HTMLButtonElement,"sn":"btn"},{"a":2,"n":"interval","t":4,"rt":$n[0].Nullable$1(System.Int32),"sn":"interval","box":function ($v) { return Bridge.box($v, System.Int32, System.Nullable.toString, System.Nullable.getHashCode);}},{"a":2,"n":"timeIndicator","t":4,"rt":HTMLInputElement,"sn":"timeIndicator"},{"a":2,"n":"times","t":4,"rt":$n[0].Array.type(System.Double),"sn":"times"}]}; }, $n);
    $m("TimeManagement.LabelList", function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[0].Boolean,HTMLDivElement],"pi":[{"n":"flexible","pt":$n[0].Boolean,"ps":0},{"n":"slot","dv":null,"o":true,"pt":HTMLDivElement,"ps":1}],"sn":"ctor"},{"a":2,"n":"LabelListChange","t":8,"sn":"LabelListChange","rt":$n[0].Void},{"a":2,"n":"Rerender","t":8,"sn":"Rerender","rt":$n[0].Void},{"a":2,"n":"Element","t":4,"rt":HTMLDivElement,"sn":"Element"},{"a":2,"n":"Flexible","t":4,"rt":$n[0].Boolean,"sn":"Flexible","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"Form","t":4,"rt":HTMLFormElement,"sn":"Form"},{"a":2,"n":"LabelInput","t":4,"rt":HTMLInputElement,"sn":"LabelInput"},{"a":2,"n":"Labels","t":4,"rt":$n[1].List$1(System.String),"sn":"Labels"},{"a":2,"n":"LabelsUL","t":4,"rt":HTMLUListElement,"sn":"LabelsUL"},{"a":2,"n":"OnLabelListChange","t":4,"rt":Function,"sn":"OnLabelListChange"},{"a":2,"n":"SubmitButton","t":4,"rt":HTMLButtonElement,"sn":"SubmitButton"}]}; }, $n);
    $m("TimeManagement.MenuElementExtensions", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"Hide","is":true,"t":8,"pi":[{"n":"me","pt":$n[2].HideableElement,"ps":0}],"sn":"Hide","rt":$n[2].HideableElement,"p":[$n[2].HideableElement]},{"a":2,"n":"Show","is":true,"t":8,"pi":[{"n":"me","pt":$n[2].HideableElement,"ps":0}],"sn":"Show","rt":$n[2].HideableElement,"p":[$n[2].HideableElement]}]}; }, $n);
    $m("TimeManagement.HideableElement", function () { return {"att":1048577,"a":2,"m":[{"a":1,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Create","is":true,"t":8,"sn":"Create","rt":$n[2].HideableElement}]}; }, $n);
    $m("TimeManagement.Assigner$1", function (T) { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[T],"pi":[{"n":"v","pt":T,"ps":0}],"sn":"ctor"},{"a":2,"n":"Value","t":16,"rt":T,"g":{"a":2,"n":"get_Value","t":8,"rt":T,"fg":"Value"},"fn":"Value"},{"a":1,"backing":true,"n":"<Value>k__BackingField","t":4,"rt":T,"sn":"Value"}]}; }, $n);
    $m("TimeManagement.AddTaskUI", function () { return {"att":1048577,"a":2,"m":[{"a":1,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Init","is":true,"t":8,"sn":"Init","rt":$n[2].AddTaskUI},{"a":2,"n":"New","t":8,"sn":"New","rt":$n[0].Void},{"a":2,"n":"Edit","t":4,"rt":Function,"sn":"Edit"}]}; }, $n);
    $m("TimeManagement.App", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"ExportToCSV","is":true,"t":8,"pi":[{"n":"fileName","pt":$n[0].String,"ps":0},{"n":"rows","pt":$n[0].Array.type(System.Array.type(System.String)),"ps":1}],"sn":"ExportToCSV","rt":$n[0].Void,"p":[$n[0].String,$n[0].Array.type(System.Array.type(System.String))]},{"a":2,"n":"Main","is":true,"t":8,"sn":"Main","rt":$n[0].Void},{"a":1,"n":"TaskList","is":true,"t":8,"sn":"TaskList","rt":HTMLDivElement},{"a":2,"n":"TasksEdited","is":true,"t":8,"sn":"TasksEdited","rt":$n[0].Void},{"a":2,"n":"TryParseTimeSpan","is":true,"t":8,"pi":[{"n":"time","pt":$n[0].String,"ps":0},{"n":"outValue","out":true,"pt":$n[0].TimeSpan,"ps":1}],"sn":"TryParseTimeSpan","rt":$n[0].Boolean,"p":[$n[0].String,$n[0].TimeSpan],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"UpdateLabels","is":true,"t":8,"sn":"UpdateLabels","rt":$n[0].Void},{"a":2,"n":"UpdateTaskList","is":true,"t":8,"sn":"UpdateTaskList","rt":$n[0].Void},{"a":2,"n":"InCAD","is":true,"t":4,"rt":$n[1].Dictionary$2(TimeManagement.Currency,System.Decimal),"sn":"InCAD"},{"a":2,"n":"Labels","is":true,"t":4,"rt":$n[1].List$1(System.String),"sn":"Labels"},{"a":2,"n":"MenuElements","is":true,"t":4,"rt":$n[1].List$1(TimeManagement.HideableElement),"sn":"MenuElements"},{"a":2,"n":"Tasks","is":true,"t":4,"rt":$n[1].List$1(TimeManagement.Task),"sn":"Tasks"},{"a":2,"n":"addTask","is":true,"t":4,"rt":$n[2].HideableElement,"sn":"addTask"},{"a":2,"n":"addTaskUI","is":true,"t":4,"rt":$n[2].AddTaskUI,"sn":"addTaskUI"},{"a":2,"n":"editButtons","is":true,"t":4,"rt":$n[0].Boolean,"sn":"editButtons","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"filterLabelList","is":true,"t":4,"rt":$n[2].LabelList,"sn":"filterLabelList"},{"a":2,"n":"filterTaskStatus","is":true,"t":4,"rt":HTMLSelectElement,"sn":"filterTaskStatus"},{"a":2,"n":"labelList","is":true,"t":4,"rt":HTMLDataListElement,"sn":"labelList"},{"a":2,"n":"labelListID","is":true,"t":4,"rt":$n[0].String,"sn":"labelListID"},{"a":2,"n":"menu","is":true,"t":4,"rt":HTMLDivElement,"sn":"menu"},{"a":2,"n":"root","is":true,"t":4,"rt":HTMLDivElement,"sn":"root"},{"a":2,"n":"taskListSlot","is":true,"t":4,"rt":HTMLDivElement,"sn":"taskListSlot"}]}; }, $n);
    $m("TimeManagement.Currency", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"CAD","is":true,"t":4,"rt":$n[2].Currency,"sn":"CAD","box":function ($v) { return Bridge.box($v, TimeManagement.Currency, System.Enum.toStringFn(TimeManagement.Currency));}},{"a":2,"n":"EUR","is":true,"t":4,"rt":$n[2].Currency,"sn":"EUR","box":function ($v) { return Bridge.box($v, TimeManagement.Currency, System.Enum.toStringFn(TimeManagement.Currency));}},{"a":2,"n":"USD","is":true,"t":4,"rt":$n[2].Currency,"sn":"USD","box":function ($v) { return Bridge.box($v, TimeManagement.Currency, System.Enum.toStringFn(TimeManagement.Currency));}}]}; }, $n);
    $m("TimeManagement.TaskState", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Complete","is":true,"t":4,"rt":$n[2].TaskState,"sn":"Complete","box":function ($v) { return Bridge.box($v, TimeManagement.TaskState, System.Enum.toStringFn(TimeManagement.TaskState));}},{"a":2,"n":"Planned","is":true,"t":4,"rt":$n[2].TaskState,"sn":"Planned","box":function ($v) { return Bridge.box($v, TimeManagement.TaskState, System.Enum.toStringFn(TimeManagement.TaskState));}},{"a":2,"n":"Started","is":true,"t":4,"rt":$n[2].TaskState,"sn":"Started","box":function ($v) { return Bridge.box($v, TimeManagement.TaskState, System.Enum.toStringFn(TimeManagement.TaskState));}}]}; }, $n);
    $m("TimeManagement.Task", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"State","t":16,"rt":$n[2].TaskState,"g":{"a":2,"n":"get_State","t":8,"rt":$n[2].TaskState,"fg":"State","box":function ($v) { return Bridge.box($v, TimeManagement.TaskState, System.Enum.toStringFn(TimeManagement.TaskState));}},"fn":"State"},{"a":2,"n":"IsComplete","t":4,"rt":$n[0].Boolean,"sn":"IsComplete","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"Labels","t":4,"rt":$n[1].List$1(System.String),"sn":"Labels"},{"a":2,"n":"MoneyAmount","t":4,"rt":$n[0].Nullable$1(System.Decimal),"sn":"MoneyAmount"},{"a":2,"n":"MoneyCurrency","t":4,"rt":$n[2].Currency,"sn":"MoneyCurrency","box":function ($v) { return Bridge.box($v, TimeManagement.Currency, System.Enum.toStringFn(TimeManagement.Currency));}},{"a":2,"n":"TaskName","t":4,"rt":$n[0].String,"sn":"TaskName"},{"a":2,"n":"TimeCreated","t":4,"rt":$n[0].Double,"sn":"TimeCreated","box":function ($v) { return Bridge.box($v, System.Double, System.Double.format, System.Double.getHashCode);}},{"a":2,"n":"TimeModified","t":4,"rt":$n[0].Double,"sn":"TimeModified","box":function ($v) { return Bridge.box($v, System.Double, System.Double.format, System.Double.getHashCode);}},{"a":2,"n":"TimeSoFar","t":4,"rt":$n[0].TimeSpan,"sn":"TimeSoFar"},{"a":2,"n":"TimeStarted","t":4,"rt":$n[0].Nullable$1(System.Double),"sn":"TimeStarted","box":function ($v) { return Bridge.box($v, System.Double, System.Nullable.toStringFn(System.Double.format), System.Nullable.getHashCodeFn(System.Double.getHashCode));}}]}; }, $n);
});
