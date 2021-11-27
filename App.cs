using Bridge;
using Bridge.Html5;
using Bridge.React;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace TimeManagement
{
    using static App;
    using static TimerButtonAndContainerMethods;

    public static class Extensions
    {
        //[Template("((e, c) => c.appendChild(e), c)({element}, {containingElem})")]
        //public static extern T AddTo<T> (this Node element, T containingElem) where T : Node;
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
        public static extern HTMLLIElement WrapDiv(this Node element);
        public static T Add<T>(this T element, params Union<Node, string>[] nodes) where T : Node
        {
            foreach (Union<Node, string> node in nodes)
                if (node.Is<string>())
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
        public static HTMLSelectElement AddEnum<T>(this HTMLSelectElement select, T? defaultValue = null) where T : struct, Enum
        {
            if (defaultValue == null)
                select.Add(new HTMLOptionElement { Value = "", Selected = true, Disable = true });
            foreach (T value in Enum.GetValues(typeof(T)))
                select.Add(new HTMLOptionElement
                {
                    Value = ((int)(object)value).ToString(),
                    Selected = object.Equals(defaultValue, value)
                }.Add(value.ToCamelString()));
            return select;
        }
        public static T Value<T> (this HTMLSelectElement select) where T : struct, Enum => (T)(object)int.Parse(select.Value);
    }
    public static class Enumerable
    {
        public static T[] Append<T>(this IEnumerable<T> arr, T value) => arr.Concat(new[] { value }).ToArray();
    }

    public static class TimerButtonAndContainerMethods
    {
        public static bool GetIsPaused (double[] state) => state.Length % 2 == 0;
        public static TimeSpan GetElapsedTime (double[] state)
        {
            double[] arr = state.Length % 2 == 1 ? state.Append(Date.Now()) : state;
            double finalTime = 0;
            for (int n = 0; n < arr.Length; n += 2)
                finalTime += arr[n + 1] - arr[n];
            return TimeSpan.FromMilliseconds(finalTime);
        }
    }

    public class TimerButton : StatelessComponent<(Action<double[]> onChange, double[] state)>
    {
        public TimerButton((Action<double[]> onChange, double[] state) props, params Union<ReactElement, string>[] children) : base(props, children) { }

        public override ReactElement Render() => DOM.Button(new ButtonAttributes
            {
                OnClick = e => props.onChange(props.state.Append(Date.Now()))
            }, props.state.Length == 0 ? "Start" : props.state.Length % 2 == 0 ? "Resume" : "Pause");
    }

    public class TimerButtonWithTime : Component<(Action<double[]> onChange, double[] state), string>
    {
        public TimerButtonWithTime((Action<double[]> onChange, double[] state) props, params Union<ReactElement, string>[] children) : base(props, children) { }

        public string ElapsedTime => GetElapsedTime(props.state).ToString(@"m\:ss");

        protected override string GetInitialState() => ElapsedTime;

        public int? TimerID;

        protected override void ComponentDidMount() =>
            TimerID = Global.SetInterval(() => SetState(ElapsedTime), 1000);

        protected override void ComponentWillUnmount()
        {
            if (TimerID is int id) Global.ClearInterval(id);
        }

        public override ReactElement Render() => DOM.Div(new Attributes(),
            new TimerButton(props), 
            $" ({ElapsedTime})"
        );
    }

    public class TimerButtonContainer : Component<object, double[]>
    {
        public TimerButtonContainer(object props = null, params Union<ReactElement, string>[] children) : base(props, children) { }

        protected override double[] GetInitialState() => new double[0];

        public override ReactElement Render() => new TimerButtonWithTime((s => SetState(s), state));
        public HTMLDivElement AsElement()
        {
            HTMLDivElement result = new HTMLDivElement();
            React.Render(this, result);
            return result;
        }

        public bool IsPaused => GetIsPaused(state);
        public TimeSpan TimeElapsed => GetElapsedTime(state);
    }

    public static class MenuElementExtensions
    {
        public static HideableElement Show(this HideableElement me)
        {
            MenuElements.ForEach(m => m.Hide());
            return Extensions.Show(me);
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

    public static class App
    {
        public static HTMLDivElement root;
        public static List<HideableElement> MenuElements = new List<HideableElement>();
        public static List<Task> Tasks = new List<Task>();

        public static HTMLDivElement menu;
        public static HideableElement newTask;
        public static HTMLDivElement taskListSlot;

        public static Dictionary<Currency, decimal> InCAD = new Dictionary<Currency, decimal>
        {
            [Currency.CAD] = 1,
            [Currency.USD] = 1.27955m /* (actual exchange rate from November 27, 2021) */ - 0.05m,
            [Currency.EUR] = 1.44870m /* (actual exchange rate from November 27, 2021) */ - 0.05m
        };

        static HideableElement NewTask()
        {
            HTMLInputElement taskName = new HTMLInputElement();
            TimerButtonContainer playPauseButton = new TimerButtonContainer();
            HTMLInputElement moneyAmount = new HTMLInputElement { Type = InputType.Number, Style = { Width = "5em", TextAlign = TextAlign.Right }, Placeholder = "130" };
            HTMLSelectElement currency = new HTMLSelectElement().AddEnum<Currency>(Currency.CAD);
            HTMLSelectElement status = new HTMLSelectElement()
                .AddElement(new HTMLOptionElement { Value = "False" }.Add("In Progress"))
                .AddElement(new HTMLOptionElement { Value = "True" }.Add("Complete"));
            void AddTask()
            {
                if (!playPauseButton.IsPaused)
                {
                    Global.Alert("The play/pause button must be paused before adding a task.");
                    return;
                }
                Tasks.Add(new Task
                {
                    TaskName = taskName.Value,
                    TimeSoFar = playPauseButton.TimeElapsed,
                    MoneyAmount = decimal.TryParse(moneyAmount.ValueAsNumber.ToString(), out decimal d) ? (decimal?)d : null,
                    MoneyCurrency = currency.Value<Currency>(),
                    IsComplete = bool.Parse(status.Value)
                });
                UpdateTaskList();
            }
            HTMLButtonElement submitButton = new HTMLButtonElement { OnClick = e => AddTask() }.AddDiv("Add Task");
            return HideableElement.Create()
                .Add(new HTMLHeadingElement(HeadingType.H1).Add("Add a Task"))
                .AddUl(
                    new Union<Node, string>[] { "Task: ", taskName },
                    playPauseButton.AsElement(),
                    new Union<Node, string>[] { "Money: ", moneyAmount, " ", currency },
                    new Union<Node, string>[] { "Status: ", status },
                    submitButton
                );
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
                );
            foreach (Task task in Tasks)
            {
                table.Add(new HTMLTableRowElement()
                    .Add(new HTMLTableDataCellElement().Add(task.TaskName))
                    .Add(new HTMLTableDataCellElement().Add(task.TimeSoFar.ToString()))
                    .Add(
                        new HTMLTableDataCellElement
                        {
                            Title = task.MoneyAmount is decimal amount ? $"{amount} {task.MoneyCurrency}" : ""
                        }.Add(task.MoneyAmount is decimal amount_ ? (amount_ * InCAD[task.MoneyCurrency]).ToString("$0.00") : "")
                    )
                    .Add(new HTMLTableDataCellElement().Add(task.TimeSoFar.Ticks == 0 ? "Not Started" : task.IsComplete ? "Complete" : "In Progress"))
                );
            }
            return div;
        }

        public static void UpdateTaskList ()
        {
            taskListSlot.InnerHTML = "";
            taskListSlot.Add(TaskList());
        }

        public static void Main ()
        {
            HTMLDivElement Menu() =>
                new HTMLDivElement().AddUl(
                    new HTMLAnchorElement
                    {
                        Href = "javascript:void(0)",
                        OnClick = _ => newTask.Show()
                    }.Add("New Task")
                );

            root = Document.Body.AppendChild<HTMLDivElement>(new HTMLDivElement());
            menu = Menu().AddToBody();
            newTask = NewTask();
            taskListSlot = new HTMLDivElement().AddToBody();
            UpdateTaskList();
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
        public List<string> Labels = new List<string>();

        public TaskState State => IsComplete ? TaskState.Complete : TimeSoFar.Ticks == 0 ? TaskState.Planned : TaskState.Started;
    }
}