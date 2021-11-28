using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace TimeManagement
{
    using static App;

    public static class Extensions
    {
        [Template("((e, c) => c.appendChild(e))({element}, {containingElem})")]
        public static extern T AddTo<T>(this T element, Node containingElem) where T : Node;
        public static T AddToBody<T> (this T n) where T : Node => App.root.AppendChild<T>(n);
        [Template("{node}.appendChild({element})")]
        public static extern T AppendChild<T> (this Node node, T element) where T : Node;
        [Template("(e => (e.style.display = 'none', e))({element})")]
        public static extern T Hide<T> (this T element) where T : HTMLElement;
        [Template("(e => (e.style.display = '', e))({element})")]
        public static extern T Show<T> (this T element) where T : HTMLElement;
        [Template("(li => (li.appendChild({element}), li))(document.createElement('li'))")]
        public static extern HTMLLIElement WrapLi (this Node element);
        [Template("(div => (div.appendChild({element}), div))(document.createElement('div'))")]
        public static extern HTMLDivElement WrapDiv(this Node element);
        public static T Add<T>(this T element, params Union<Node, string>[] nodes) where T : Node
        {
            foreach (Union<Node, string> node in nodes)
                if (node == null)
                    continue;
                else if (node.Is<string>())
                    element.AppendChild(new Text(node.As<string>()));
                else
                    element.AppendChild(node.As<Node>());
            return element;
        }
        public static T AddElement<T>(this T element, params Union<Node, string>[] nodes) where T : Node => element.Add(nodes);
        public static T AddDiv<T>(this T element, params Union<Node, string>[] nodes) where T : Node
            => element.Add(new HTMLDivElement().Add(nodes));
        public static T AddUl<T>(this T element, params Union<Node, Union<Node, string>[], string>[] nodes) where T : Node
            => element.Add(new HTMLUListElement().Add(nodes.Map(
                n => (Union<Node, string>)(
                    n.Is<Union<Node, string>[]>() ?
                        new HTMLLIElement().Add(n.As<Union<Node, string>[]>()) :
                        n.Is<string>()
                            ? new HTMLLIElement().Add(n.As<string>())
                            : new HTMLLIElement().Add(n.As<Node>())
                )
            )));
        public static string AddCamelSpace(this string str) => Regex.Replace(Regex.Replace(str,
            @"([^_a-z])([^_a-z][a-z])", "$1 $2"),
            @"([a-z])([^_a-z])", "$1 $2");
        public static string ToCamelString<T>(this T e) where T : struct, Enum =>
            e.ToString().AddCamelSpace().Replace('_', ' ');
        public static HTMLSelectElement AddEnum<T>(this HTMLSelectElement select, T? defaultValue = null, string defaultValueString = "") where T : struct, Enum
        {
            if (defaultValue == null)
                select.Add(new HTMLOptionElement { Value = "", Selected = true, Disable = true }.Add(defaultValueString));
            foreach (T value in Enum.GetValues(typeof(T)))
                select.Add(new HTMLOptionElement
                {
                    Value = ((int)(object)value).ToString(),
                    Selected = object.Equals(defaultValue, value)
                }.Add(value.ToCamelString()));
            return select;
        }
        public static T? Value<T> (this HTMLSelectElement select) where T : struct, Enum => select.Value == "" ? null : (T?)(T)(object)int.Parse(select.Value);
        public static HTMLSelectElement SetValue<T> (this HTMLSelectElement select, T value) where T : struct, Enum
        {
            select.Value = ((int)(object)value).ToString();
            return select;
        }
        public static string ToTimeString (this TimeSpan time) => time.ToString(time >= TimeSpan.FromHours(1) ? @"h\:mm\:ss" : @"m\:ss");
        [Template("(e => (e.setCustomValidity({message}), e.reportValidity(), e))({element})")]
        public static extern T SetCustomValidity<T> (this T element, string message) where T : HTMLElement;
        [Template("(e => (e.setAttribute('list', {datalistID}), e))({element})")]
        public static extern HTMLInputElement SetDataList (this HTMLInputElement element, string datalistID);
        //[Template("{elem}.appendChild({adding})")]
        //public static extern T Append<T> (this Node elem, T adding);

        public static Union<Node, string>[] JoinBR (this IEnumerable<string> strings)
        {
            IEnumerable<Union<Node, string>> Inner ()
            {
                using (var enumer = strings.GetEnumerator())
                {
                    if (!enumer.MoveNext()) yield break;
                    yield return enumer.Current;
                    while (enumer.MoveNext())
                    {
                        yield return new HTMLBRElement();
                        yield return enumer.Current;
                    }
                }
            }
            return Inner().ToArray();
        }
    }
    public static class Enumerable
    {
        public static IEnumerable<T> Prepend<T>(this IEnumerable<T> arr, T value) => new[] { value }.Concat(arr);
        public static T[] Append<T>(this IEnumerable<T> arr, T value) => arr.Concat(new[] { value }).ToArray();

        public static IEnumerable<(T, T2)> Zip<T, T2> (this IEnumerable<T> e_a, IEnumerable<T2> e_b) => e_a.Zip(e_b, (a, b) => (a, b));
    }

    public class Timer
    {
        public double[] times = new double[0];
        public HTMLDivElement Element;
        public int? interval;

        public Timer(HTMLDivElement slot = null)
        {
            Element = slot ?? new HTMLDivElement();
            Rerender();
        }

        public bool IsPaused => times.Length % 2 == 0;
        public TimeSpan TimeElapsed
        {
            get
            {
                double[] arr = IsPaused ? times : times.Append(Date.Now());
                double finalTime = 0;
                for (int n = 0; n < arr.Length; n += 2)
                    finalTime += arr[n + 1] - arr[n];
                return TimeSpan.FromMilliseconds(finalTime);
            }
        }
        public string TimeElapsedString => TimeElapsed.ToTimeString();

        public HTMLButtonElement btn;
        public HTMLInputElement timeIndicator;

        public void Rerender()
        {
            Element.InnerHTML = "";
            Element.Add(btn = new HTMLButtonElement
            {
                OnClick = _ =>
                {
                    times = times.Append(Date.Now());
                    Update();
                    if (interval is int i) Global.ClearInterval(i);
                    if (!IsPaused) interval = Global.SetInterval(Update, 1000);
                    timeIndicator.Disabled = !IsPaused;
                }
            });
            Element.Add(" (", timeIndicator = new HTMLInputElement
            {
                Style = { Width = "4em" },
                OnChange = e =>
                {
                    if (TryParseTimeSpan(e.CurrentTarget.Value, out TimeSpan ts))
                        times = new[] { Date.Now() - ts.TotalMilliseconds, Date.Now() };
                }   
            }, ")");
            Update();
        }

        public void Update()
        {
            btn.InnerHTML = "";
            btn.Add(times.Length == 0 ? "Start" : IsPaused ? "Resume" : "Pause");
            timeIndicator.InnerHTML = "";
            timeIndicator.Value = TimeElapsedString;
        }
    }

    public class LabelList
    {
        public HTMLDivElement Element;
        public HTMLFormElement Form;
        public HTMLButtonElement SubmitButton;
        public HTMLInputElement LabelInput;
        public HTMLUListElement LabelsUL;
        public static int _idCounter = 0;
        public HTMLDataListElement list;
        public HTMLElement List => Flexible ? (HTMLElement)list : LabelInput;

        public List<string> Labels = new List<string>();
        public bool Flexible;

        public Action OnLabelListChange;

        public LabelList(bool flexible, HTMLDivElement slot = null)
        {
            Flexible = flexible;
            if (Flexible) list = Document.Body.AppendChild<HTMLDataListElement>(new HTMLDataListElement { Id = "_0" + _idCounter++ });
            Element = slot ?? new HTMLDivElement();
            Rerender();
            LabelListChange();
            App.LabelListChange += () => LabelListChange(callOnLabelListChange: true);
        }

        public void Rerender ()
        {
            Element.InnerHTML = "";
            LabelsUL = new HTMLUListElement().AddTo(Element);
            Form = new HTMLFormElement
            {
                OnSubmit = e =>
                {
                    e.PreventDefault();

                    string adding = LabelInput.Value;
                    Labels.Add(adding);
                    LabelsUL.InsertBefore(
                        new HTMLLIElement
                        {
                            Style = { Cursor = Cursor.Pointer },
                            OnClick = _ =>
                            {
                                LabelsUL.RemoveChild(_.Target);
                                Labels.Remove(adding);
                                LabelListChange();
                                OnLabelListChange?.Invoke();
                            }
                        }.Add(adding),
                        LabelsUL.LastElementChild
                    );
                    LabelInput.Value = "";
                    LabelInput.Focus();
                    LabelListChange();
                    OnLabelListChange?.Invoke();
                }
            };
            LabelInput =
                (Flexible
                    ? new HTMLInputElement { Required = true, OnInput = _ => { if (App.Labels.Contains(LabelInput.Value)) SubmitButton.Click(); } }.SetDataList(list.Id)
                    : new HTMLSelectElement { Required = true, OnInput = _ => SubmitButton.Click() }.As<HTMLInputElement>()
                ).AddTo(Form);
            SubmitButton = new HTMLButtonElement { OnClick = _ => SubmitButton.SetCustomValidity("") }.Add("+").AddTo(Form);
            LabelsUL.Add(new HTMLLIElement().Add(Form));
            var labels = Labels;
            Labels = new List<string>();
            foreach (string label in labels)
            {
                LabelInput.Value = label;
                SubmitButton.Click();
            }
        }

        public void LabelListChange (bool callOnLabelListChange = false)
        {
            string fll = LabelInput.Value;
            List.InnerHTML = "";
            foreach (string label in App.Labels.Except(this.Labels).OrderBy(l => l))
            {
                HTMLOptionElement opt = new HTMLOptionElement { Value = label };
                if (!Flexible) opt.Add(label);
                List.Add(opt);
            }
            if (!Flexible)
            {
                if (this.Labels.RemoveAll(label => !App.Labels.Contains(label)) > 0) Rerender();
                LabelInput.Value = fll;
                if (callOnLabelListChange)
                    OnLabelListChange?.Invoke();
            }
        }
    }

    public static class MenuElementExtensions
    {
        public static HideableElement Show(this HideableElement me)
        {
            MenuElements.ForEach(m => ((HTMLElement)m).Hide());
            menu.Hide();
            editButtons = false;
            UpdateTaskList();
            return Extensions.Show(me);
        }

        public static HideableElement Hide (this HideableElement me)
        {
            ((HTMLElement)me).Hide();
            menu.Show();
            editButtons = true;
            UpdateTaskList();
            return me;
        }
    }

    public class HideableElement : HTMLElement
    {
        private extern HideableElement();

        public static HideableElement Create()
        {
            HideableElement r = new HTMLDivElement().AddToBody().Hide().As<HideableElement>();
            MenuElements.Add(r);
            return r;
        }
    }

    public class Assigner<T>
    {
        public Assigner(T v) => Value = v;
        public T Value { get; }
    }

    public class AddTaskUI
    {
        private AddTaskUI() { }

        public Action<Task> Edit;
        public void New() => Edit(null);

        public static AddTaskUI Init()
        {

            HTMLInputElement taskName = new HTMLInputElement();
            Timer playPauseButton = new Timer();
            HTMLInputElement moneyAmount = new HTMLInputElement { Type = InputType.Number, Style = { Width = "5em", TextAlign = TextAlign.Right }, Placeholder = "130" };
            HTMLSelectElement currency = new HTMLSelectElement().AddEnum<Currency>(Currency.CAD);
            HTMLSelectElement status = new HTMLSelectElement()
                .AddElement(new HTMLOptionElement { Value = "False" }.Add("In Progress"))
                .AddElement(new HTMLOptionElement { Value = "True" }.Add("Complete"));
            LabelList labelList = new LabelList(flexible: true);

            Task editing = null;
            void AddTask()
            {
                if (!playPauseButton.IsPaused)
                {
                    playPauseButton.btn.SetCustomValidity("The timer is not paused.");
                    return;
                }
                if (labelList.LabelInput.Value != "")
                {
                    labelList.SubmitButton.SetCustomValidity("There is an unadded label");
                    return;
                }
                Task newTask = new Assigner<Task>(editing ?? new Task())
                {
                    Value =
                    {
                        TaskName = taskName.Value,
                        TimeSoFar = playPauseButton.TimeElapsed,
                        MoneyAmount = decimal.TryParse(moneyAmount.ValueAsNumber.ToString(), out decimal d) ? (decimal?)d : null,
                        MoneyCurrency = currency.Value<Currency>().Value,
                        IsComplete = bool.Parse(status.Value),
                        Labels = labelList.Labels,
                        TimeModified = Date.Now()
                    }
                }.Value;
                if (newTask.TimeSoFar.Ticks > 0) newTask.TimeStarted = newTask.TimeModified;
                if (editing == null)
                {
                    newTask.TimeCreated = newTask.TimeModified;
                    Tasks.Add(newTask);
                }
                TasksEdited();
                addTask.Hide();
            }
            HTMLHeadingElement heading = new HTMLHeadingElement(HeadingType.H1);
            HTMLButtonElement submitButton = new HTMLButtonElement { OnClick = e => AddTask() };
            addTask = HideableElement.Create()
                .Add(new HTMLAnchorElement { Href = "javascript:void(0)", OnClick = _ => addTask.Hide() }.Add("Close"))
                .Add(heading)
                .AddUl(
                    new Union<Node, string>[] { "Task: ", taskName },
                    playPauseButton.Element,
                    new Union<Node, string>[] { "Money: ", moneyAmount, " ", currency },
                    new Union<Node, string>[] { "Status: ", status },
                    new Union<Node, string>[] { "Labels: ", labelList.Element},
                    submitButton
                );
            void Edit(Task t)
            {
                heading.InnerHTML = "";
                heading.Add(t is Task ? "Edit a Task" : "Add a Task");
                submitButton.InnerHTML = "";
                submitButton.Add(t is Task ? "Edit Task" : "Add Task");
                t = (editing = t) ?? new Task { TaskName = "" };
                taskName.Value = t.TaskName;
                playPauseButton.times = t.TimeSoFar.Ticks == 0
                    ? new double[0]
                    : new double[] { Date.Now() - t.TimeSoFar.TotalMilliseconds, Date.Now() };
                playPauseButton.Update();
                if (t.MoneyAmount is decimal amount)
                    moneyAmount.ValueAsNumber = (double)amount;
                else
                    moneyAmount.Value = "";
                currency.SetValue(t.MoneyCurrency);
                status.Value = t.IsComplete.ToString();
                labelList.Labels = t.Labels;
                labelList.Rerender();
                addTask.Show();
            }
            return new AddTaskUI { Edit = Edit };
        }
    }

    public static class App
    {
        public static HTMLDivElement root;
        public static List<HideableElement> MenuElements = new List<HideableElement>();
        public static List<Task> Tasks = new List<Task>();
        public static List<string> Labels = new List<string>();
        public static event Action LabelListChange;
        public static LabelList filterLabelList;
        public static HTMLSelectElement filterTaskStatus;
        public const string labelListID = "labelList";
        public static bool editButtons;

        public static HTMLDivElement menu;
        public static HideableElement addTask;
        public static HTMLDivElement taskListSlot;

        public static AddTaskUI addTaskUI;

        public static Dictionary<Currency, decimal> InCAD = new Dictionary<Currency, decimal>
        {
            [Currency.CAD] = 1,
            [Currency.USD] = 1.27955m /* (actual exchange rate from November 27, 2021) */ - 0.05m,
            [Currency.EUR] = 1.44870m /* (actual exchange rate from November 27, 2021) */ - 0.05m
        };

        public static bool TryParseTimeSpan (string time, out TimeSpan outValue)
        {
            outValue = TimeSpan.Zero;
            string[] split = time.Split(':');
            split.Reverse();
            List<int> splitParsed = new List<int>();
            foreach (string s in split)
            {
                if (!int.TryParse(s, out int p)) return false;
                splitParsed.Add(p);
            }
            outValue = TimeSpan.FromSeconds(
                splitParsed.Zip(
                    new[] { 1, 60, 60 * 60 },
                    (p, mul) => p * mul
                ).Sum()
            );
            return true;
        }

        public static void TasksEdited ()
        {
            Global.LocalStorage.SetItem("tasks", JsonConvert.SerializeObject(Tasks));
            UpdateLabels();
            LabelListChange?.Invoke();
        }

        public static void UpdateLabels()
        {
            Labels = Tasks.SelectMany(t => t.Labels).Distinct().ToList();
        }

        static HTMLDivElement TaskList()
        {
            HTMLDivElement div = new HTMLDivElement();
            HTMLTableElement table = new HTMLTableElement()
                .Add(new HTMLTableRowElement()
                    .Add(new HTMLTableHeaderCellElement().Add("Task Name"))
                    .Add(new HTMLTableHeaderCellElement().Add("Time So Far"))
                    .Add(new HTMLTableHeaderCellElement().Add("Money (CAD)"))
                    .Add(new HTMLTableHeaderCellElement().Add("Task Status"))
                    .Add(new HTMLTableHeaderCellElement().Add("Labels"))
                    .Add(editButtons ? new HTMLTableHeaderCellElement().Add("Edit") : null)
                    .Add(new HTMLTableHeaderCellElement().Add("$/hour"))
                    .Add(editButtons ? new HTMLTableHeaderCellElement().Add("Remove") : null)
                ).AddTo(div);
            IEnumerable<Task> tasks = Tasks;
            if (filterLabelList.Labels.Count > 0)
                tasks = tasks.Where(t => t.Labels.Any(filterLabelList.Labels.Contains));
            if (filterTaskStatus.Value<TaskState>() is TaskState taskState)
                tasks = tasks.Where(t => t.State == taskState);
            foreach (Task task in tasks)
            {
                table.Add(new HTMLTableRowElement()
                    .Add(new HTMLTableDataCellElement().Add(task.TaskName))
                    .Add(new HTMLTableDataCellElement().Add(task.TimeSoFar.ToTimeString()))
                    .Add(
                        new HTMLTableDataCellElement
                        {
                            Title = task.MoneyAmount is decimal amount ? $"{amount} {task.MoneyCurrency}" : ""
                        }.Add(task.MoneyAmount is decimal amount_ ? (amount_ * InCAD[task.MoneyCurrency]).ToString("0") : "")
                    )
                    .Add(new HTMLTableDataCellElement().Add(task.State.ToCamelString()))
                    .Add(new HTMLTableDataCellElement { Style = { TextAlign = TextAlign.Left } }.Add(task.Labels.JoinBR()))
                    .Add(editButtons ? new HTMLTableDataCellElement().Add(new HTMLAnchorElement
                    {
                        Href = "javascript:void(0)",
                        OnClick = _ => addTaskUI.Edit(task)
                    }.Add("Edit")) : null)
                    .Add(new HTMLTableDataCellElement().Add(
                        task.MoneyAmount is decimal money && task.TimeSoFar.Ticks > 0 && task.IsComplete
                            ? ((double)(money * InCAD[task.MoneyCurrency]) / task.TimeSoFar.TotalHours).ToString("0")
                            : ""))
                    .Add(editButtons ? new HTMLTableDataCellElement().Add(new HTMLAnchorElement
                    {
                        Href = "javascript:void(0)",
                        OnClick = _ =>
                        {
                            Tasks.Remove(task);
                            TasksEdited();
                        }
                    }.Add("Remove")) : null)
                );
            }
            return div;
        }

        public static void UpdateTaskList ()
        {
            taskListSlot.InnerHTML = "";
            taskListSlot.Add(TaskList());
        }

        [Script(@"
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/""/g, '""""');
            if (result.search(/(""|,|\n)/g) >= 0)
                result = '""' + result + '""';
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
        var link = document.createElement(""a"");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute(""href"", url);
            link.setAttribute(""download"", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }")]
        public static extern void ExportToCSV(string fileName, string[][] rows);

        public static void Main ()
        {
            Document.Head.AppendChild(new HTMLStyleElement().Add("th, td { text-align:center; border: 1px solid black }"));

            if (Global.LocalStorage.GetItem("tasks") is string serialized)
                Tasks = JsonConvert.DeserializeObject<List<Task>>(serialized);
            UpdateLabels();

            HTMLDivElement Menu() =>
                new HTMLDivElement().AddUl(
                    new HTMLAnchorElement
                    {
                        Href = "javascript:void(0)",
                        OnClick = _ =>
                        {
                            addTaskUI.New();
                            addTask.Show();
                        }
                    }.Add("+ New Task")
                );

            root = Document.Body.AppendChild<HTMLDivElement>(new HTMLDivElement());
            menu = Menu().AddToBody();
            addTaskUI = AddTaskUI.Init();
            new HTMLFieldSetElement()
                .Add(new HTMLLegendElement().Add("Filters"))
                .AddUl(
                    new Union<Node, string>[]
                    {
                        "Labels:",
                        (filterLabelList = new LabelList(flexible: false){ OnLabelListChange = UpdateTaskList }).Element
                    },
                    new Union<Node, string>[]
                    {
                        "Task Status: ",
                        filterTaskStatus = new HTMLSelectElement { OnInput = _ => UpdateTaskList() }.AddEnum<TaskState>(defaultValueString: "Any")
                    }
                )
                .AddToBody();
            new HTMLBRElement().AddToBody();

            taskListSlot = new HTMLDivElement().AddToBody();
            editButtons = true;
            UpdateTaskList();

            new HTMLBRElement().AddToBody();
            new HTMLAnchorElement
            {
                Href = "javascript:void(0)",
                OnClick = _ =>
                {
                    ExportToCSV($"Time Information ({DateTime.Now:MMMM d, yyyy}).csv", Tasks.Select((t, i) =>
                        new string[]
                        {
                            t.TaskName,
                            t.TimeSoFar.TotalHours.ToString(),
                            (t.MoneyAmount * InCAD[t.MoneyCurrency]).ToString(),
                            t.State.ToCamelString(),
                            string.Join("\n", t.Labels),
                            $"=$C{i + 2}/$B{i + 2}"
                        }
                    ).Prepend(new[] { "Task Name", "Hours Spent", "Money (CAD)", "Task Status", "Labels", "$/hour" }).ToArray());
                }
            }.Add("CSV Export").AddToBody();
        }
    }

    public enum Currency { CAD, USD, EUR }
    public enum TaskState { Planned, Started, Complete }
    public class Task
    {
        public string TaskName;
        public TimeSpan TimeSoFar;
        public bool IsComplete;
        public decimal? MoneyAmount;
        public Currency MoneyCurrency;
        public double TimeCreated;
        public double? TimeStarted;
        public double TimeModified;
        public List<string> Labels = new List<string>();

        public TaskState State => IsComplete ? TaskState.Complete : TimeSoFar.Ticks == 0 ? TaskState.Planned : TaskState.Started;
    }
}