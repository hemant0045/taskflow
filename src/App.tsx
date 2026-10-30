import { useEffect, useMemo, useState, type FormEvent } from 'react'

type Task = {
  id: string
  title: string
  details: string
  category: 'Work' | 'Personal' | 'Study'
  priority: 'Low' | 'Medium' | 'High'
  dueDate: string
  done: boolean
}

const starterTasks: Task[] = [
  { id: '1', title: 'Finish project proposal', details: 'Polish the outline and share it with the team.', category: 'Work', priority: 'High', dueDate: todayPlus(0), done: false },
  { id: '2', title: 'Read 20 pages', details: 'Continue the book before bed.', category: 'Personal', priority: 'Low', dueDate: todayPlus(1), done: false },
  { id: '3', title: 'Review React hooks', details: 'Practice useState and useEffect examples.', category: 'Study', priority: 'Medium', dueDate: todayPlus(0), done: true },
  { id: '4', title: 'Plan weekly schedule', details: 'Block focus time for important work.', category: 'Personal', priority: 'Medium', dueDate: todayPlus(2), done: false },
]

function todayPlus(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const initialForm = {
  title: '',
  details: '',
  category: 'Work' as Task['category'],
  priority: 'Medium' as Task['priority'],
  dueDate: todayPlus(0),
}

function Icon({ name }: { name: string }) {
  const common = { width: 19, height: 19, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    moon: <><path d="M20.8 13A8.5 8.5 0 0 1 11 3.2 8.5 8.5 0 1 0 20.8 13Z"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m-11 0 1 14h12l1-14M10 10v6m4-6v6"/></>,
    edit: <><path d="m14 5 5 5M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></>,
  }
  return <svg {...common}>{paths[name] ?? paths.grid}</svg>
}

function formatDate(date: string) {
  if (!date) return 'No due date'
  const parsed = new Date(`${date}T12:00:00`)
  if (date === todayPlus(0)) return 'Today'
  if (date === todayPlus(1)) return 'Tomorrow'
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('taskflow-tasks')
      return saved ? JSON.parse(saved) as Task[] : starterTasks
    } catch { return starterTasks }
  })
  const [dark, setDark] = useState(() => localStorage.getItem('taskflow-theme') === 'dark')
  const [activeView, setActiveView] = useState('All tasks')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All priorities')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])
  useEffect(() => {
    localStorage.setItem('taskflow-theme', dark ? 'dark' : 'light')
  }, [dark])

  const completed = tasks.filter(task => task.done).length
  const pending = tasks.length - completed
  const dueToday = tasks.filter(task => !task.done && task.dueDate === todayPlus(0)).length
  const visibleTasks = useMemo(() => tasks.filter(task => {
    const matchesSearch = `${task.title} ${task.details} ${task.category}`.toLowerCase().includes(search.toLowerCase())
    const matchesView = activeView === 'All tasks'
      || (activeView === 'Today' && task.dueDate === todayPlus(0))
      || (activeView === 'Upcoming' && task.dueDate > todayPlus(0) && !task.done)
      || (activeView === 'Completed' && task.done)
      || task.category === activeView
    const matchesPriority = filter === 'All priorities' || task.priority === filter
    return matchesSearch && matchesView && matchesPriority
  }), [tasks, search, activeView, filter])

  function openNewTask() {
    setEditing(null)
    setForm(initialForm)
    setModalOpen(true)
  }

  function openEditTask(task: Task) {
    setEditing(task.id)
    setForm({ title: task.title, details: task.details, category: task.category, priority: task.priority, dueDate: task.dueDate })
    setModalOpen(true)
  }

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) return
    if (editing) {
      setTasks(current => current.map(task => task.id === editing ? { ...task, ...form, title } : task))
    } else {
      setTasks(current => [{ ...form, title, id: crypto.randomUUID(), done: false }, ...current])
    }
    setModalOpen(false)
    setForm(initialForm)
    setEditing(null)
  }

  function toggleTask(id: string) {
    setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task))
  }

  function deleteTask(id: string) {
    setTasks(current => current.filter(task => task.id !== id))
  }

  const navItems = [
    { label: 'All tasks', icon: 'grid', count: tasks.length },
    { label: 'Today', icon: 'sun', count: dueToday },
    { label: 'Upcoming', icon: 'calendar', count: tasks.filter(t => !t.done && t.dueDate > todayPlus(0)).length },
    { label: 'Completed', icon: 'check', count: completed },
  ]

  return (
    <div className={`app-shell ${dark ? 'dark' : ''}`}>
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Icon name="check"/></div><span>taskflow</span><button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><Icon name="close"/></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(item => <button key={item.label} className={`nav-item ${activeView === item.label ? 'active' : ''}`} onClick={() => { setActiveView(item.label); setMobileNav(false) }}><Icon name={item.icon}/><span>{item.label}</span><span className="nav-count">{item.count}</span></button>)}
        </nav>
        <div className="sidebar-divider"/>
        <div className="workspace-label">CATEGORIES</div>
        <nav className="main-nav" aria-label="Task categories">
          {(['Work', 'Personal', 'Study'] as const).map((category, index) => <button key={category} className={`nav-item ${activeView === category ? 'active' : ''}`} onClick={() => { setActiveView(category); setMobileNav(false) }}><span className={`category-dot dot-${index}`}/><span>{category}</span><span className="nav-count">{tasks.filter(t => t.category === category).length}</span></button>)}
        </nav>
        <div className="sidebar-spacer"/>
        <div className="sidebar-tip"><div className="tip-icon"><Icon name="spark"/></div><strong>Small steps, big wins.</strong><p>Keep your focus on what matters most today.</p><div className="tip-progress"><span style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }}/></div><small>{completed} of {tasks.length} tasks completed</small></div>
        <div className="profile"><div className="avatar">H</div><div className="profile-copy"><strong>Hey, there!</strong><span>Personal workspace</span></div><span className="profile-menu">•••</span></div>
      </aside>

      {mobileNav && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)}/>}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Icon name="menu"/></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activeView}</strong></div>
          <div className="topbar-actions"><div className="today-pill"><span className="live-dot"/>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div><button className="icon-button theme-toggle" onClick={() => setDark(value => !value)} aria-label="Toggle theme"><Icon name={dark ? 'sun' : 'moon'}/></button><div className="avatar top-avatar">H</div></div>
        </header>

        <section className="page">
          <div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR PERSONAL WORKSPACE</div><h1>Make today <span>count.</span></h1><p className="welcome-subtitle">A little progress each day adds up to big results.</p></div><button className="primary-button" onClick={openNewTask}><Icon name="plus"/> New task</button></div>

          <section className="stats-grid" aria-label="Task statistics">
            <article className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon purple"><Icon name="grid"/></span></div><div className="stat-value">{tasks.length}<span className="stat-unit">tasks</span></div><div className="stat-foot">Everything on your plate</div></article>
            <article className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon blue"><Icon name="calendar"/></span></div><div className="stat-value">{pending}<span className="stat-unit">tasks</span></div><div className="stat-foot"><span className="tiny-dot blue-dot"/> Keep the momentum going</div></article>
            <article className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon green"><Icon name="check"/></span></div><div className="stat-value">{completed}<span className="stat-unit">tasks</span></div><div className="stat-foot"><span className="tiny-dot green-dot"/> Nice work, keep it up</div></article>
            <article className="stat-card progress-card"><div className="stat-top"><span>Completion rate</span><span className="stat-icon orange"><Icon name="spark"/></span></div><div className="stat-value">{tasks.length ? Math.round(completed / tasks.length * 100) : 0}<span className="stat-unit">%</span></div><div className="mini-progress"><span style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }}/></div><div className="stat-foot">You’re making progress</div></article>
          </section>

          <section className="task-section">
            <div className="section-heading"><div><h2>{activeView}</h2><p>You’ve got this. One task at a time.</p></div><div className="task-total">{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}</div></div>
            <div className="toolbar"><label className="search-box"><Icon name="search"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search your tasks..." aria-label="Search tasks"/>{search && <button onClick={() => setSearch('')} aria-label="Clear search"><Icon name="close"/></button>}</label><select value={filter} onChange={event => setFilter(event.target.value)} aria-label="Filter by priority"><option>All priorities</option><option>High</option><option>Medium</option><option>Low</option></select></div>

            {visibleTasks.length ? <div className="task-list">{visibleTasks.map(task => <article className={`task-card ${task.done ? 'task-done' : ''}`} key={task.id}><button className={`task-check ${task.done ? 'checked' : ''}`} onClick={() => toggleTask(task.id)} aria-label={task.done ? 'Mark as incomplete' : 'Mark as complete'}>{task.done && <Icon name="check"/>}</button><div className="task-main"><div className="task-title-row"><h3>{task.title}</h3><span className={`priority priority-${task.priority.toLowerCase()}`}><span/>{task.priority}</span></div>{task.details && <p className="task-details">{task.details}</p>}<div className="task-meta"><span className={`category-tag tag-${task.category.toLowerCase()}`}><span className="category-dot"/> {task.category}</span><span className="due-date"><Icon name="calendar"/>{formatDate(task.dueDate)}</span>{task.done && <span className="completed-label">Completed</span>}</div></div><div className="task-actions"><button className="icon-button" onClick={() => openEditTask(task)} aria-label={`Edit ${task.title}`}><Icon name="edit"/></button><button className="icon-button delete-button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}><Icon name="trash"/></button></div></article>)}</div> : <div className="empty-state"><div className="empty-icon"><Icon name="check"/></div><h3>No tasks found</h3><p>Try another search or create a task to get started.</p><button className="primary-button" onClick={openNewTask}><Icon name="plus"/> Create a task</button></div>}

            <button className="add-task-row" onClick={openNewTask}><span className="add-task-plus"><Icon name="plus"/></span> Add another task</button>
          </section>
          <footer className="footer"><span>Made for your focus <span className="heart">♥</span></span><span>TaskFlow <span className="footer-separator">·</span> Your tasks stay on this device</span></footer>
        </section>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setModalOpen(false) }}><section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> TASK DETAILS</div><h2 id="modal-title">{editing ? 'Edit task' : 'Create a task'}</h2><p>Make it clear, make it doable.</p></div><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close dialog"><Icon name="close"/></button></div><form onSubmit={submitTask}><label className="field-label">Task name <span>*</span><input autoFocus required maxLength={100} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="e.g. Finish project proposal"/></label><label className="field-label">Description <span className="optional">(optional)</span><textarea rows={3} maxLength={300} value={form.details} onChange={event => setForm({ ...form, details: event.target.value })} placeholder="Add a few details to help you get started..."/></label><div className="form-two-col"><label className="field-label">Category<select value={form.category} onChange={event => setForm({ ...form, category: event.target.value as Task['category'] })}><option>Work</option><option>Personal</option><option>Study</option></select></label><label className="field-label">Priority<select value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value as Task['priority'] })}><option>Low</option><option>Medium</option><option>High</option></select></label></div><label className="field-label">Due date<input type="date" value={form.dueDate} onChange={event => setForm({ ...form, dueDate: event.target.value })}/></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-button"><Icon name={editing ? 'check' : 'plus'}/>{editing ? 'Save changes' : 'Create task'}</button></div></form></section></div>}
    </div>
  )
}