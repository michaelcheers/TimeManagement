/**
 * @version 1.0.0
 * @author TimeManagement
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("TimeManagement", function ($asm, globals) {
    "use strict";

    Bridge.define("TimeManagement.AddTaskUI", {
        statics: {
            methods: {
                Init: function () {
                    var $t;
                    var Edit = null;
                    var AddTask = null;

                    var taskName = document.createElement("input");
                    var playPauseButton = new TimeManagement.Timer();
                    var moneyAmount = ($t = document.createElement("input"), $t.type = "number", $t.style.width = "5em", $t.style.textAlign = "right", $t.placeholder = "130", $t);
                    var currency = TimeManagement.Extensions.AddEnum(TimeManagement.Currency, document.createElement("select"), TimeManagement.Currency.CAD);
                    var status = TimeManagement.Extensions.AddElement(HTMLSelectElement, TimeManagement.Extensions.AddElement(HTMLSelectElement, document.createElement("select"), [TimeManagement.Extensions.Add(HTMLOptionElement, ($t = document.createElement("option"), $t.value = "False", $t), ["In Progress"])]), [TimeManagement.Extensions.Add(HTMLOptionElement, ($t = document.createElement("option"), $t.value = "True", $t), ["Complete"])]);
                    var labelList = new TimeManagement.LabelList(true, void 0);

                    var editing = null;

                    var heading = document.createElement("h1");
                    AddTask = function () {
                        var $t1;
                        if (!playPauseButton.IsPaused) {
                            (e => (e.setCustomValidity("The timer is not paused."), e.reportValidity(), e))(playPauseButton.btn);
                            return;
                        }

                        if (!Bridge.referenceEquals(labelList.LabelInput.value, "")) {
                            (e => (e.setCustomValidity("There is an unadded label"), e.reportValidity(), e))(labelList.SubmitButton);
                            return;
                        }

                        var d = { };
                        var newTask = ($t1 = new (TimeManagement.Assigner$1(TimeManagement.Task))(editing || new TimeManagement.Task()), $t1.Value.TaskName = taskName.value, $t1.Value.TimeSoFar = playPauseButton.TimeElapsed, $t1.Value.MoneyAmount = System.Decimal.tryParse(System.Double.format(moneyAmount.valueAsNumber), null, d) ? Bridge.cast(d.v, System.Decimal, true) : System.Decimal.lift(null), $t1.Value.MoneyCurrency = System.Nullable.getValue(TimeManagement.Extensions.Value(TimeManagement.Currency, currency)), $t1.Value.IsComplete = System.Boolean.parse(status.value), $t1.Value.Labels = labelList.Labels, $t1.Value.TimeModified = Date.now(), $t1).Value;
                        if (newTask.TimeSoFar.getTicks().gt(System.Int64(0))) {
                            newTask.TimeStarted = newTask.TimeModified;
                        }
                        if (editing == null) {
                            newTask.TimeCreated = newTask.TimeModified;
                            TimeManagement.App.Tasks.add(newTask);
                        }

                        TimeManagement.App.TasksEdited();
                        TimeManagement.MenuElementExtensions.Hide(TimeManagement.App.addTask);
                    };
                    var submitButton = ($t = document.createElement("button"), $t.onclick = function (e) {
                        AddTask();
                    }, $t);
                    TimeManagement.App.addTask = TimeManagement.Extensions.AddUl(TimeManagement.HideableElement, TimeManagement.Extensions.Add(TimeManagement.HideableElement, TimeManagement.Extensions.Add(TimeManagement.HideableElement, TimeManagement.HideableElement.Create(), [TimeManagement.Extensions.Add(HTMLAnchorElement, ($t = document.createElement("a"), $t.href = "javascript:void(0)", $t.onclick = $asm.$.TimeManagement.AddTaskUI.f1, $t), ["Close"])]), [heading]), [System.Array.init(["Task: ", taskName], System.Object), playPauseButton.Element, System.Array.init(["Money: ", moneyAmount, " ", currency], System.Object), System.Array.init(["Status: ", status], System.Object), System.Array.init(["Labels: ", labelList.Element], System.Object), submitButton]);

                    Edit = function (t) {
                        var $t1;
                        heading.innerHTML = "";
                        TimeManagement.Extensions.Add(HTMLHeadingElement, heading, [Bridge.hasValue(t) ? "Edit a Task" : "Add a Task"]);
                        submitButton.innerHTML = "";
                        TimeManagement.Extensions.Add(HTMLButtonElement, submitButton, [Bridge.hasValue(t) ? "Edit Task" : "Add Task"]);
                        t = ((editing = t)) || ($t1 = new TimeManagement.Task(), $t1.TaskName = "", $t1);
                        taskName.value = t.TaskName;
                        playPauseButton.times = t.TimeSoFar.getTicks().equals(System.Int64(0)) ? System.Array.init(0, 0, System.Double) : System.Array.init([Date.now() - t.TimeSoFar.getTotalMilliseconds(), Date.now()], System.Double);
                        playPauseButton.Update();
                        var amount;
                        if (System.Nullable.liftne("ne", ((amount = Bridge.is(t.MoneyAmount, System.Decimal) ? System.Nullable.getValue(t.MoneyAmount) : null)), System.Decimal.lift(null))) {
                            moneyAmount.valueAsNumber = System.Decimal.toFloat(amount);
                        } else {
                            moneyAmount.value = "";
                        }
                        TimeManagement.Extensions.SetValue(TimeManagement.Currency, currency, t.MoneyCurrency);
                        status.value = System.Boolean.toString(t.IsComplete);
                        labelList.Labels = t.Labels;
                        labelList.Rerender();
                        TimeManagement.MenuElementExtensions.Show(TimeManagement.App.addTask);
                    };
                    return ($t = new TimeManagement.AddTaskUI(), $t.Edit = Edit, $t);
                }
            }
        },
        fields: {
            Edit: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            New: function () {
                this.Edit(null);
            }
        }
    });

    Bridge.ns("TimeManagement.AddTaskUI", $asm.$);

    Bridge.apply($asm.$.TimeManagement.AddTaskUI, {
        f1: function (_) {
            TimeManagement.MenuElementExtensions.Hide(TimeManagement.App.addTask);
        }
    });

    Bridge.define("TimeManagement.App", {
        main: function Main () {
            var $t, $t1, $t2;
            var Menu = null;
            document.head.appendChild(TimeManagement.Extensions.Add(HTMLStyleElement, document.createElement("style"), ["th, td { text-align:center; border: 1px solid black }"]));

            TimeManagement.App.labelList = ((e, c) => c.appendChild(e))(($t = document.createElement("datalist"), $t.id = TimeManagement.App.labelListID, $t), document.body);
            var serialized;
            if (((serialized = Bridge.as(Bridge.global.localStorage.getItem("tasks"), System.String))) != null) {
                TimeManagement.App.Tasks = Newtonsoft.Json.JsonConvert.DeserializeObject(serialized, System.Collections.Generic.List$1(TimeManagement.Task));
            }
            TimeManagement.App.UpdateLabels();



            TimeManagement.App.root = document.body.appendChild(document.createElement("div"));
            Menu = $asm.$.TimeManagement.App.f2;
            TimeManagement.App.menu = TimeManagement.Extensions.AddToBody(HTMLDivElement, Menu());
            TimeManagement.App.addTaskUI = TimeManagement.AddTaskUI.Init();
            TimeManagement.Extensions.AddToBody(HTMLFieldSetElement, TimeManagement.Extensions.AddUl(HTMLFieldSetElement, TimeManagement.Extensions.Add(HTMLFieldSetElement, document.createElement("fieldset"), [TimeManagement.Extensions.Add(HTMLLegendElement, document.createElement("legend"), ["Filters"])]), [System.Array.init(["Labels:", (($t = ($t1 = new TimeManagement.LabelList(false, void 0), $t1.OnLabelListChange = TimeManagement.App.UpdateTaskList, $t1), TimeManagement.App.filterLabelList = $t, $t)).Element], System.Object), System.Array.init(["Task Status: ", ($t1 = TimeManagement.Extensions.AddEnum(TimeManagement.TaskState, ($t2 = document.createElement("select"), $t2.oninput = $asm.$.TimeManagement.App.f3, $t2), void 0, "Any"), TimeManagement.App.filterTaskStatus = $t1, $t1)], System.Object)]));
            TimeManagement.Extensions.AddToBody(HTMLBRElement, document.createElement("br"));

            TimeManagement.App.taskListSlot = TimeManagement.Extensions.AddToBody(HTMLDivElement, document.createElement("div"));
            TimeManagement.App.editButtons = true;
            TimeManagement.App.UpdateTaskList();
            TimeManagement.Extensions.AddToBody(HTMLBRElement, document.createElement("br"));
            TimeManagement.Extensions.AddToBody(HTMLAnchorElement, TimeManagement.Extensions.Add(HTMLAnchorElement, ($t2 = document.createElement("a"), $t2.href = "javascript:void(0)", $t2.onclick = $asm.$.TimeManagement.App.f5, $t2), ["CSV Export"]));
        },
        statics: {
            fields: {
                labelListID: null,
                root: null,
                MenuElements: null,
                Tasks: null,
                Labels: null,
                labelList: null,
                filterLabelList: null,
                filterTaskStatus: null,
                editButtons: false,
                menu: null,
                addTask: null,
                taskListSlot: null,
                addTaskUI: null,
                InCAD: null
            },
            ctors: {
                init: function () {
                    this.labelListID = "labelList";
                    this.MenuElements = new (System.Collections.Generic.List$1(TimeManagement.HideableElement)).ctor();
                    this.Tasks = new (System.Collections.Generic.List$1(TimeManagement.Task)).ctor();
                    this.Labels = new (System.Collections.Generic.List$1(System.String)).ctor();
                    this.InCAD = $asm.$.TimeManagement.App.f6(new (System.Collections.Generic.Dictionary$2(TimeManagement.Currency,System.Decimal)).ctor());
                }
            },
            methods: {
                TryParseTimeSpan: function (time, outValue) {
                    var $t;
                    outValue.v = System.TimeSpan.zero;
                    var split = System.String.split(time, [58].map(function (i) {{ return String.fromCharCode(i); }}));
                    split.reverse();
                    var splitParsed = new (System.Collections.Generic.List$1(System.Int32)).ctor();
                    $t = Bridge.getEnumerator(split);
                    try {
                        while ($t.moveNext()) {
                            var s = $t.Current;
                            var p = { };
                            if (!System.Int32.tryParse(s, p)) {
                                return false;
                            }
                            splitParsed.add(p.v);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    outValue.v = System.TimeSpan.fromSeconds(System.Linq.Enumerable.from(splitParsed, System.Int32).zip(System.Array.init([1, 60, 3600], System.Int32), $asm.$.TimeManagement.App.f7).sum());
                    return true;
                },
                TasksEdited: function () {
                    Bridge.global.localStorage.setItem("tasks", Newtonsoft.Json.JsonConvert.SerializeObject(TimeManagement.App.Tasks));
                    TimeManagement.App.UpdateLabels();
                    TimeManagement.App.filterLabelList.LabelListChange();
                },
                UpdateLabels: function () {
                    var $t, $t1;
                    TimeManagement.App.Labels = System.Linq.Enumerable.from(TimeManagement.App.Tasks, TimeManagement.Task).selectMany($asm.$.TimeManagement.App.f8).distinct().toList(System.String);
                    TimeManagement.App.labelList.innerHTML = "";
                    $t = Bridge.getEnumerator(System.Linq.Enumerable.from(TimeManagement.App.Labels, System.String).orderBy($asm.$.TimeManagement.App.f9));
                    try {
                        while ($t.moveNext()) {
                            var label = $t.Current;
                            TimeManagement.Extensions.Add(HTMLDataListElement, TimeManagement.App.labelList, [($t1 = document.createElement("option"), $t1.value = label, $t1)]);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                },
                TaskList: function () {
                    var $t, $t1;
                    var div = document.createElement("div");
                    var table = ((e, c) => c.appendChild(e))(TimeManagement.Extensions.Add(HTMLTableElement, document.createElement("table"), [TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, document.createElement("tr"), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["Task Name"])]), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["Time So Far"])]), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["Money (CAD)"])]), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["Task Status"])]), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["Labels"])]), [TimeManagement.App.editButtons ? TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["Edit"]) : null]), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["$/hour"])]), [TimeManagement.App.editButtons ? TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["Remove"]) : null])]), div);
                    var tasks = TimeManagement.App.Tasks;
                    if (TimeManagement.App.filterLabelList.Labels.Count > 0) {
                        tasks = System.Linq.Enumerable.from(tasks, TimeManagement.Task).where($asm.$.TimeManagement.App.f10);
                    }
                    var taskState = new TimeManagement.TaskState();
                    if (((taskState = Bridge.is(TimeManagement.Extensions.Value(TimeManagement.TaskState, TimeManagement.App.filterTaskStatus), System.Int32) ? System.Nullable.getValue(TimeManagement.Extensions.Value(TimeManagement.TaskState, TimeManagement.App.filterTaskStatus)) : null)) != null) {
                        tasks = System.Linq.Enumerable.from(tasks, TimeManagement.Task).where(function (t) {
                                return t.State === taskState;
                            });
                    }
                    $t = Bridge.getEnumerator(tasks, TimeManagement.Task);
                    try {
                        while ($t.moveNext()) {
                            var task = { v : $t.Current };
                            var amount;
                            var amount_;
                            var money;
                            TimeManagement.Extensions.Add(HTMLTableElement, table, [TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, TimeManagement.Extensions.Add(HTMLTableRowElement, document.createElement("tr"), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [task.v.TaskName])]), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [TimeManagement.Extensions.ToTimeString(task.v.TimeSoFar)])]), [TimeManagement.Extensions.Add(HTMLTableCellElement, ($t1 = document.createElement("td"), $t1.title = System.Nullable.liftne("ne", ((amount = Bridge.is(task.v.MoneyAmount, System.Decimal) ? System.Nullable.getValue(task.v.MoneyAmount) : null)), System.Decimal.lift(null)) ? System.String.format("{0} {1}", amount, Bridge.box(task.v.MoneyCurrency, TimeManagement.Currency, System.Enum.toStringFn(TimeManagement.Currency))) : "", $t1), [System.Nullable.liftne("ne", ((amount_ = Bridge.is(task.v.MoneyAmount, System.Decimal) ? System.Nullable.getValue(task.v.MoneyAmount) : null)), System.Decimal.lift(null)) ? Bridge.Int.format((amount_.mul(TimeManagement.App.InCAD.getItem(task.v.MoneyCurrency))), "0") : ""])]), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [TimeManagement.Extensions.ToCamelString(TimeManagement.TaskState, task.v.State)])]), [TimeManagement.Extensions.Add(HTMLTableCellElement, ($t1 = document.createElement("td"), $t1.style.textAlign = "left", $t1), TimeManagement.Extensions.JoinBR(task.v.Labels))]), [TimeManagement.App.editButtons ? TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [TimeManagement.Extensions.Add(HTMLAnchorElement, ($t1 = document.createElement("a"), $t1.href = "javascript:void(0)", $t1.onclick = (function ($me, task) {
                                return function (_) {
                                    TimeManagement.App.addTaskUI.Edit(task.v);
                                };
                            })(this, task), $t1), ["Edit"])]) : null]), [TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [System.Nullable.liftne("ne", ((money = Bridge.is(task.v.MoneyAmount, System.Decimal) ? System.Nullable.getValue(task.v.MoneyAmount) : null)), System.Decimal.lift(null)) && task.v.TimeSoFar.getTicks().gt(System.Int64(0)) && task.v.IsComplete ? System.Double.format((System.Decimal.toFloat((money.mul(TimeManagement.App.InCAD.getItem(task.v.MoneyCurrency)))) / task.v.TimeSoFar.getTotalHours()), "0") : ""])]), [TimeManagement.App.editButtons ? TimeManagement.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [TimeManagement.Extensions.Add(HTMLAnchorElement, ($t1 = document.createElement("a"), $t1.href = "javascript:void(0)", $t1.onclick = (function ($me, task) {
                                return function (_) {
                                    TimeManagement.App.Tasks.remove(task.v);
                                    TimeManagement.App.TasksEdited();
                                };
                            })(this, task), $t1), ["Remove"])]) : null])]);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    return div;
                },
                UpdateTaskList: function () {
                    TimeManagement.App.taskListSlot.innerHTML = "";
                    TimeManagement.Extensions.Add(HTMLDivElement, TimeManagement.App.taskListSlot, [TimeManagement.App.TaskList()]);
                },
                ExportToCSV: function (fileName, rows) {
                    
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, fileName);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
                }
            }
        }
    });

    Bridge.ns("TimeManagement.App", $asm.$);

    Bridge.apply($asm.$.TimeManagement.App, {
        f1: function (_) {
            TimeManagement.App.addTaskUI.New();
            TimeManagement.MenuElementExtensions.Show(TimeManagement.App.addTask);
        },
        f2: function () {
            var $t1;
            return TimeManagement.Extensions.AddUl(HTMLDivElement, document.createElement("div"), [TimeManagement.Extensions.Add(HTMLAnchorElement, ($t1 = document.createElement("a"), $t1.href = "javascript:void(0)", $t1.onclick = $asm.$.TimeManagement.App.f1, $t1), ["+ New Task"])]);
        },
        f3: function (_) {
            TimeManagement.App.UpdateTaskList();
        },
        f4: function (t, i) {
            return System.Array.init([t.TaskName, System.Double.format(t.TimeSoFar.getTotalHours()), (System.Nullable.lift2("mul", t.MoneyAmount, TimeManagement.App.InCAD.getItem(t.MoneyCurrency))).toString(), TimeManagement.Extensions.ToCamelString(TimeManagement.TaskState, t.State), Bridge.toArray(t.Labels).join("\n"), System.String.format("=$C{0}/$B{1}", Bridge.box(((i + 2) | 0), System.Int32), Bridge.box(((i + 2) | 0), System.Int32))], System.String);
        },
        f5: function (_) {
            var $t3;
            TimeManagement.App.ExportToCSV(System.String.format("Time Information ({0:MMMM d, yyyy}).csv", [Bridge.box(System.DateTime.getNow(), System.DateTime, System.DateTime.format)]), ($t3 = System.Array.type(System.String), System.Linq.Enumerable.from(TimeManagement.Enumerable.Prepend(System.Array.type(System.String), System.Linq.Enumerable.from(TimeManagement.App.Tasks, TimeManagement.Task).select($asm.$.TimeManagement.App.f4), System.Array.init(["Task Name", "Hours Spent", "Money (CAD)", "Task Status", "Labels", "$/hour"], System.String)), $t3).ToArray($t3)));
        },
        f6: function (_o1) {
            _o1.setItem(TimeManagement.Currency.CAD, System.Decimal(1));
            _o1.setItem(TimeManagement.Currency.USD, System.Decimal(1.22955, 5));
            _o1.setItem(TimeManagement.Currency.EUR, System.Decimal(1.39870, 5));
            return _o1;
        },
        f7: function (p1, mul) {
            return Bridge.Int.mul(p1, mul);
        },
        f8: function (t) {
            return t.Labels;
        },
        f9: function (l) {
            return l;
        },
        f10: function (t) {
            return System.Linq.Enumerable.from(t.Labels, System.String).any(Bridge.fn.cacheBind(TimeManagement.App.filterLabelList.Labels, TimeManagement.App.filterLabelList.Labels.contains));
        }
    });

    Bridge.define("TimeManagement.Assigner$1", function (T) { return {
        props: {
            Value: Bridge.getDefaultValue(T)
        },
        ctors: {
            ctor: function (v) {
                this.$initialize();
                this.Value = v;
            }
        }
    }; });

    Bridge.define("TimeManagement.Currency", {
        $kind: "enum",
        statics: {
            fields: {
                CAD: 0,
                USD: 1,
                EUR: 2
            }
        }
    });

    Bridge.define("TimeManagement.Enumerable", {
        statics: {
            methods: {
                Prepend: function (T, arr, value) {
                    return System.Linq.Enumerable.from(System.Array.init([value], T), T).concat(arr);
                },
                Append: function (T, arr, value) {
                    return System.Linq.Enumerable.from(arr, T).concat(System.Array.init([value], T)).ToArray(T);
                },
                Zip: function (T, T2, e_a, e_b) {
                    return System.Linq.Enumerable.from(e_a, T).zip(e_b, function (a, b) {
                            return new (System.ValueTuple$2(T,T2)).$ctor1(a, b);
                        });
                }
            }
        }
    });

    Bridge.define("TimeManagement.Extensions", {
        statics: {
            methods: {
                AddToBody: function (T, n) {
                    return TimeManagement.App.root.appendChild(n);
                },
                Add: function (T, element, nodes) {
                    var $t;
                    if (nodes === void 0) { nodes = []; }
                    $t = Bridge.getEnumerator(nodes);
                    try {
                        while ($t.moveNext()) {
                            var node = $t.Current;
                            if (node == null) {
                                continue;
                            } else {
                                if (Bridge.is(node, System.String)) {
                                    element.appendChild(document.createTextNode(node));
                                } else {
                                    element.appendChild(node);
                                }
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    return element;
                },
                AddElement: function (T, element, nodes) {
                    if (nodes === void 0) { nodes = []; }
                    return TimeManagement.Extensions.Add(T, element, nodes);
                },
                AddDiv: function (T, element, nodes) {
                    if (nodes === void 0) { nodes = []; }
                    return TimeManagement.Extensions.Add(T, element, [TimeManagement.Extensions.Add(HTMLDivElement, document.createElement("div"), nodes)]);
                },
                AddUl: function (T, element, nodes) {
                    if (nodes === void 0) { nodes = []; }
                    return TimeManagement.Extensions.Add(T, element, [TimeManagement.Extensions.Add(HTMLUListElement, document.createElement("ul"), nodes.map($asm.$.TimeManagement.Extensions.f1))]);
                },
                AddCamelSpace: function (str) {
                    return System.Text.RegularExpressions.Regex.replace(System.Text.RegularExpressions.Regex.replace(str, "([^_a-z])([^_a-z][a-z])", "$1 $2"), "([a-z])([^_a-z])", "$1 $2");
                },
                ToCamelString: function (T, e) {
                    return System.String.replaceAll(TimeManagement.Extensions.AddCamelSpace(System.Enum.toString(Bridge.getType(e, T), e)), String.fromCharCode(95), String.fromCharCode(32));
                },
                AddEnum: function (T, select, defaultValue, defaultValueString) {
                    var $t, $t1;
                    if (defaultValue === void 0) { defaultValue = null; }
                    if (defaultValueString === void 0) { defaultValueString = ""; }
                    if (defaultValue == null) {
                        select.add(TimeManagement.Extensions.Add(HTMLOptionElement, ($t = document.createElement("option"), $t.value = "", $t.selected = true, $t.disable = true, $t), [defaultValueString]));
                    }
                    $t = Bridge.getEnumerator(System.Enum.getValues(T));
                    try {
                        while ($t.moveNext()) {
                            var value = Bridge.cast($t.Current, T);
                            select.add(TimeManagement.Extensions.Add(HTMLOptionElement, ($t1 = document.createElement("option"), $t1.value = Bridge.toString(System.Nullable.getValue(Bridge.cast(Bridge.unbox(value, System.Int32), System.Int32))), $t1.selected = Bridge.equals(defaultValue, value), $t1), [TimeManagement.Extensions.ToCamelString(T, value)]));
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    return select;
                },
                Value: function (T, select) {
                    return Bridge.referenceEquals(select.value, "") ? null : Bridge.cast(System.Nullable.getValue(Bridge.cast(Bridge.unbox(Bridge.box(System.Int32.parse(select.value), System.Int32), T), T)), T, true);
                },
                SetValue: function (T, select, value) {
                    select.value = Bridge.toString(System.Nullable.getValue(Bridge.cast(Bridge.unbox(value, System.Int32), System.Int32)));
                    return select;
                },
                ToTimeString: function (time) {
                    return time.toString(System.TimeSpan.gte(time, System.TimeSpan.fromHours(1)) ? "h\\:mm\\:ss" : "m\\:ss");
                },
                JoinBR: function (strings) {
                    var $t;
                    var Inner = null;

                    Inner = function () {
                        return new (Bridge.GeneratorEnumerable$1(System.Object))(Bridge.fn.bind(this, function ()  {
                            var $step = 0,
                                $jumpFromFinally,
                                $returnValue,
                                enumer,
                                $async_e,
                                $async_e1;

                            var $enumerator = new (Bridge.GeneratorEnumerator$1(System.Object))(Bridge.fn.bind(this, function () {
                                try {
                                    for (;;) {
                                        switch ($step) {
                                            case 0: {
                                                enumer = Bridge.getEnumerator(strings, System.String);
                                                $step = 1;
                                                continue;
                                            }
                                            case 1: {
                                                if (!enumer.System$Collections$IEnumerator$moveNext()) {
                                                        $step = 2;
                                                        continue;
                                                    } 
                                                    $step = 3;
                                                    continue;
                                            }
                                            case 2: {
                                                return false;
                                            }
                                            case 3: {
                                                $enumerator.current = enumer[Bridge.geti(enumer, "System$Collections$Generic$IEnumerator$1$System$String$Current$1", "System$Collections$Generic$IEnumerator$1$Current$1")];
                                                    $step = 4;
                                                    return true;
                                            }
                                            case 4: {
                                                if ( enumer.System$Collections$IEnumerator$moveNext() ) {
                                                        $step = 5;
                                                        continue;
                                                    } 
                                                    $step = 8;
                                                    continue;
                                            }
                                            case 5: {
                                                $enumerator.current = document.createElement("br");
                                                    $step = 6;
                                                    return true;
                                            }
                                            case 6: {
                                                $enumerator.current = enumer[Bridge.geti(enumer, "System$Collections$Generic$IEnumerator$1$System$String$Current$1", "System$Collections$Generic$IEnumerator$1$Current$1")];
                                                    $step = 7;
                                                    return true;
                                            }
                                            case 7: {
                                                
                                                    $step = 4;
                                                    continue;
                                            }
                                            case 8: {
                                                $step = 9;
                                                continue;
                                            }
                                            case 9: {
                                                if (Bridge.hasValue(enumer)) enumer.System$IDisposable$Dispose();

                                                    if ($jumpFromFinally > -1) {
                                                        $step = $jumpFromFinally;
                                                        $jumpFromFinally = null;
                                                    } else if ($async_e) {
                                                        throw $async_e;
                                                        return;
                                                    } else if (Bridge.isDefined($returnValue)) {
                                                        $tcs.setResult($returnValue);
                                                        return;
                                                    }
                                                $step = 10;
                                                continue;
                                            }
                                            case 10: {

                                            }
                                            default: {
                                                return false;
                                            }
                                        }
                                    }
                                } catch($async_e1) {
                                    $async_e = System.Exception.create($async_e1);
                                    if ($step >= 1 && $step <= 8){

                                        $step = 9;
                                        $enumerator.moveNext();
                                        return;
                                    }
                                    throw $async_e;
                                }
                            }), function () {
                                if ($step >= 1 && $step <= 8){

                                    $step = 9;
                                    $enumerator.moveNext();
                                    return;
                                }

                            });
                            return $enumerator;
                        }));
                    };
                    return ($t = System.Object, System.Linq.Enumerable.from(Inner(), $t).ToArray($t));
                }
            }
        }
    });

    Bridge.ns("TimeManagement.Extensions", $asm.$);

    Bridge.apply($asm.$.TimeManagement.Extensions, {
        f1: function (n) {
            return Bridge.is(n, System.Array.type(System.Object)) ? TimeManagement.Extensions.Add(HTMLLIElement, document.createElement("li"), n) : Bridge.is(n, System.String) ? TimeManagement.Extensions.Add(HTMLLIElement, document.createElement("li"), [n]) : TimeManagement.Extensions.Add(HTMLLIElement, document.createElement("li"), [n]);
        }
    });

    Bridge.define("TimeManagement.HideableElement", {
        inherits: [HTMLElement],
        statics: {
            methods: {
                Create: function () {
                    var r = (e => (e.style.display = 'none', e))(TimeManagement.Extensions.AddToBody(HTMLDivElement, document.createElement("div")));
                    TimeManagement.App.MenuElements.add(r);
                    return r;
                }
            }
        }
    });

    Bridge.define("TimeManagement.LabelList", {
        fields: {
            Element: null,
            Form: null,
            SubmitButton: null,
            LabelInput: null,
            LabelsUL: null,
            Labels: null,
            Flexible: false,
            OnLabelListChange: null
        },
        ctors: {
            init: function () {
                this.Labels = new (System.Collections.Generic.List$1(System.String)).ctor();
            },
            ctor: function (flexible, slot) {
                if (slot === void 0) { slot = null; }

                this.$initialize();
                this.Flexible = flexible;
                this.Element = slot || document.createElement("div");
                this.Rerender();
                this.LabelListChange();
            }
        },
        methods: {
            Rerender: function () {
                var $t;
                this.Element.innerHTML = "";
                this.LabelsUL = ((e, c) => c.appendChild(e))(document.createElement("ul"), this.Element);
                this.Form = ($t = document.createElement("form"), $t.onsubmit = Bridge.fn.bind(this, $asm.$.TimeManagement.LabelList.f1), $t);
                this.LabelInput = ((e, c) => c.appendChild(e))((this.Flexible ? (e => (e.setAttribute('list', TimeManagement.App.labelListID), e))(($t = document.createElement("input"), $t.required = true, $t)) : ($t = document.createElement("select"), $t.required = true, $t.oninput = Bridge.fn.bind(this, $asm.$.TimeManagement.LabelList.f2), $t)), this.Form);
                this.SubmitButton = ((e, c) => c.appendChild(e))(TimeManagement.Extensions.Add(HTMLButtonElement, document.createElement("button"), ["+"]), this.Form);
                TimeManagement.Extensions.Add(HTMLUListElement, this.LabelsUL, [TimeManagement.Extensions.Add(HTMLLIElement, document.createElement("li"), [this.Form])]);
                var labels = this.Labels;
                this.Labels = new (System.Collections.Generic.List$1(System.String)).ctor();
                $t = Bridge.getEnumerator(labels);
                try {
                    while ($t.moveNext()) {
                        var label = $t.Current;
                        this.LabelInput.value = label;
                        this.SubmitButton.click();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            LabelListChange: function () {
                var $t, $t1;
                if (this.Flexible) {
                    return;
                }
                var fll = this.LabelInput.value;
                try {
                    this.LabelInput.innerHTML = "";
                    $t = Bridge.getEnumerator(System.Linq.Enumerable.from(TimeManagement.App.Labels, System.String).except(this.Labels).orderBy($asm.$.TimeManagement.LabelList.f3));
                    try {
                        while ($t.moveNext()) {
                            var label = $t.Current;
                            TimeManagement.Extensions.Add(HTMLInputElement, this.LabelInput, [TimeManagement.Extensions.Add(HTMLOptionElement, ($t1 = document.createElement("option"), $t1.value = label, $t1), [label])]);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    if (this.Labels.RemoveAll($asm.$.TimeManagement.LabelList.f4) === 0) {
                        return;
                    }
                    this.Rerender();
                } finally {
                    this.LabelInput.value = fll;
                    !Bridge.staticEquals(this.OnLabelListChange, null) ? this.OnLabelListChange() : null;
                }
            }
        }
    });

    Bridge.ns("TimeManagement.LabelList", $asm.$);

    Bridge.apply($asm.$.TimeManagement.LabelList, {
        f1: function (e) {
            var $t1;
            e.preventDefault();

            var adding = this.LabelInput.value;
            this.Labels.add(adding);
            this.LabelsUL.insertBefore(TimeManagement.Extensions.Add(HTMLLIElement, ($t1 = document.createElement("li"), $t1.style.cursor = "pointer", $t1.onclick = Bridge.fn.bind(this, function (_) {
                this.LabelsUL.removeChild(_.target);
                this.Labels.remove(adding);
                this.LabelListChange();
            }), $t1), [adding]), this.LabelsUL.lastElementChild);
            this.LabelInput.value = "";
            this.LabelInput.focus();
            this.LabelListChange();
        },
        f2: function (_) {
            this.SubmitButton.click();
        },
        f3: function (l) {
            return l;
        },
        f4: function (label1) {
            return !TimeManagement.App.Labels.contains(label1);
        }
    });

    Bridge.define("TimeManagement.MenuElementExtensions", {
        statics: {
            methods: {
                Show: function (me) {
                    TimeManagement.App.MenuElements.ForEach($asm.$.TimeManagement.MenuElementExtensions.f1);
                    (e => (e.style.display = 'none', e))(TimeManagement.App.menu);
                    TimeManagement.App.editButtons = false;
                    TimeManagement.App.UpdateTaskList();
                    return (e => (e.style.display = '', e))(me);
                },
                Hide: function (me) {
                    (e => (e.style.display = 'none', e))(Bridge.cast(me, HTMLElement));
                    (e => (e.style.display = '', e))(TimeManagement.App.menu);
                    TimeManagement.App.editButtons = true;
                    TimeManagement.App.UpdateTaskList();
                    return me;
                }
            }
        }
    });

    Bridge.ns("TimeManagement.MenuElementExtensions", $asm.$);

    Bridge.apply($asm.$.TimeManagement.MenuElementExtensions, {
        f1: function (m) {
            (e => (e.style.display = 'none', e))(Bridge.cast(m, HTMLElement));
        }
    });

    Bridge.define("TimeManagement.Task", {
        fields: {
            TaskName: null,
            TimeSoFar: null,
            IsComplete: false,
            MoneyAmount: null,
            MoneyCurrency: 0,
            TimeCreated: 0,
            TimeStarted: null,
            TimeModified: 0,
            Labels: null
        },
        props: {
            State: {
                get: function () {
                    return this.IsComplete ? TimeManagement.TaskState.Complete : this.TimeSoFar.getTicks().equals(System.Int64(0)) ? TimeManagement.TaskState.Planned : TimeManagement.TaskState.Started;
                }
            }
        },
        ctors: {
            init: function () {
                this.TimeSoFar = new System.TimeSpan();
                this.Labels = new (System.Collections.Generic.List$1(System.String)).ctor();
            }
        }
    });

    Bridge.define("TimeManagement.TaskState", {
        $kind: "enum",
        statics: {
            fields: {
                Planned: 0,
                Started: 1,
                Complete: 2
            }
        }
    });

    Bridge.define("TimeManagement.Timer", {
        fields: {
            times: null,
            Element: null,
            interval: null,
            btn: null,
            timeIndicator: null
        },
        props: {
            IsPaused: {
                get: function () {
                    return this.times.length % 2 === 0;
                }
            },
            TimeElapsed: {
                get: function () {
                    var arr = this.IsPaused ? this.times : TimeManagement.Enumerable.Append(System.Double, this.times, Date.now());
                    var finalTime = 0;
                    for (var n = 0; n < arr.length; n = (n + 2) | 0) {
                        finalTime += arr[System.Array.index(((n + 1) | 0), arr)] - arr[System.Array.index(n, arr)];
                    }
                    return System.TimeSpan.fromMilliseconds(finalTime);
                }
            },
            TimeElapsedString: {
                get: function () {
                    return TimeManagement.Extensions.ToTimeString(this.TimeElapsed);
                }
            }
        },
        ctors: {
            init: function () {
                this.times = System.Array.init(0, 0, System.Double);
            },
            ctor: function (slot) {
                if (slot === void 0) { slot = null; }

                this.$initialize();
                this.Element = slot || document.createElement("div");
                this.Rerender();
            }
        },
        methods: {
            Rerender: function () {
                var $t;
                this.Element.innerHTML = "";
                TimeManagement.Extensions.Add(HTMLDivElement, this.Element, [(this.btn = ($t = document.createElement("button"), $t.onclick = Bridge.fn.bind(this, $asm.$.TimeManagement.Timer.f1), $t))]);
                TimeManagement.Extensions.Add(HTMLDivElement, this.Element, [" (", (this.timeIndicator = ($t = document.createElement("input"), $t.style.width = "4em", $t.onchange = Bridge.fn.bind(this, $asm.$.TimeManagement.Timer.f2), $t)), ")"]);
                this.Update();
            },
            Update: function () {
                this.btn.innerHTML = "";
                TimeManagement.Extensions.Add(HTMLButtonElement, this.btn, [this.times.length === 0 ? "Start" : this.IsPaused ? "Resume" : "Pause"]);
                this.timeIndicator.innerHTML = "";
                this.timeIndicator.value = this.TimeElapsedString;
            }
        }
    });

    Bridge.ns("TimeManagement.Timer", $asm.$);

    Bridge.apply($asm.$.TimeManagement.Timer, {
        f1: function (_) {
            this.times = TimeManagement.Enumerable.Append(System.Double, this.times, Date.now());
            this.Update();
            var i;
            if (((i = Bridge.is(this.interval, System.Int32) ? System.Nullable.getValue(this.interval) : null)) != null) {
                Bridge.global.clearInterval(i);
            }
            if (!this.IsPaused) {
                this.interval = Bridge.global.setInterval(Bridge.fn.cacheBind(this, this.Update), 1000);
            }
            this.timeIndicator.disabled = !this.IsPaused;
        },
        f2: function (e) {
            var ts = { };
            if (TimeManagement.App.TryParseTimeSpan(e.currentTarget.value, ts)) {
                this.times = System.Array.init([Date.now() - ts.v.getTotalMilliseconds(), Date.now()], System.Double);
            }
        }
    });
});
