import { createSelector } from 'reselect'
import { uniq } from '../../utils/utils'

const allNotesInternal = state => {return (state && state.notes )? state.notes.filter(n=>n.schema === "note" && !n.deleted) : [] }
const notes = state => {return (state && state.notes ) ? state.notes : [] }
export const configs = state => state && state.configs

export const notebookSelector = createSelector(
  allNotesInternal,
  (all) => all.filter(n => n.showInMenu)
)
export const findSelectedNote = createSelector(
  allNotesInternal,
  configs,
  (all, configs) => {
    return all.filter(n=> n._id === configs.selectedNote)[0]
  }
)
export const allNotes = createSelector(
  allNotesInternal,
  (all) => all
)
export const allNotesEverything = createSelector(
  notes,
  (all) => all
)

export const findExistingTags = createSelector(
  allNotesInternal,
  (all) => (all.reduce((initial, item) => {
    return (item.tags && item.tags.length > 0 )? uniq([initial, item.tags].flat()) : initial
  }, []))
)

export const findChildren = createSelector(
  allNotesInternal,
  findSelectedNote,
  (all, note) => all.filter(n => note && note.children && note.children.indexOf(n._id) > -1)
)
export const findChildrenOfNote = (note) => {
  return createSelector(
    allNotesInternal,
    (all) => {
    return all.filter(n => n.parent === note._id)

  }
    )
}
export const findChildrenOfNoteInclDeleted = (note) => {
  return createSelector(
    allNotesEverything,
    (notes) => {
    return notes.filter(n => n.parent === note._id)

  }
    )
}
export const findNote = (id) => {
  return createSelector(
    allNotesInternal,
    (all) => {
      const results = all.filter(n => n._id === id)
    return results.length === 1 ? results[0] : null

  }
    )
}
