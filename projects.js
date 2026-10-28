/* The work. One entry per project; the home wall, quick play and the case study page all read this list.
   slug: used in the case study address, project.html#<slug>
   c: filter category (video, photo, graphics, global)
   v: placeholder loop in media/ (no extension), or leave out for a flat color
   Everything in [BRACKETS] is placeholder copy. */
window.EM_PROJECTS = [
  { n: '01', slug: 'project-01', c: 'video', wide: 1, tags: 'video · brand', bg: '#EDEBE4', fg: '#0E0E0E', v: 'loop-01-drift' },
  { n: '02', slug: 'project-02', c: 'graphics', tags: 'graphics · culture', bg: '#0E0E0E', fg: '#EDEBE4', v: 'loop-02-bloom' },
  { n: '03', slug: 'project-03', c: 'global', tags: 'global · brand', bg: '#2C5FD0', fg: '#EDEBE4' },
  { n: '04', slug: 'project-04', c: 'photo', tags: 'photo · culture', bg: '#8FA5B5', fg: '#0E0E0E' },
  { n: '05', slug: 'project-05', c: 'video', tags: 'video · original', bg: '#C9892F', fg: '#0E0E0E', v: 'loop-03-mesh' },
  { n: '06', slug: 'project-06', c: 'graphics', wide: 1, tags: 'graphics · brand', bg: '#6E5AA8', fg: '#EDEBE4' },
  { n: '07', slug: 'project-07', c: 'photo', tags: 'photo · brand', bg: '#EDEBE4', fg: '#0E0E0E' },
  { n: '08', slug: 'project-08', c: 'global', tags: 'global · culture', bg: '#5F7D52', fg: '#EDEBE4', v: 'loop-04-tide' },
  { n: '09', slug: 'project-09', c: 'video', tags: 'video · culture', bg: '#7B4A2A', fg: '#EDEBE4' },
  { n: '10', slug: 'project-10', c: 'graphics', tags: 'graphics · original', bg: '#8D7B3C', fg: '#0E0E0E', v: 'loop-05-iris' }
];

/* Defaults every case study shows until a project has its own copy. */
window.EM_CASE_DEFAULTS = {
  title: '[PROJECT TITLE]',
  client: '[CLIENT]',
  year: '[YEAR]',
  role: '[WHAT EYEMONGER DID]',
  format: '[FILM, CAMPAIGN, IDENTITY…]',
  line: '[ONE LINE ABOUT THE PROJECT]',
  lede: '[ONE OR TWO SENTENCES THAT SAY WHAT THIS PROJECT IS AND WHY IT MATTERS.]',
  brief: '[WHAT THE CLIENT CAME TO US WITH. TWO OR THREE SENTENCES.]',
  made: '[WHAT WE MADE, HOW WE MADE IT, AND THE IDEA THAT HELD IT TOGETHER. THREE OR FOUR SENTENCES.]',
  reception: '[WHAT HAPPENED AFTER IT WENT OUT: VIEWS, PRESS, RESULTS. TWO SENTENCES.]',
  quote: '[A LINE FROM THE DIRECTOR OR CLIENT ABOUT MAKING IT.]',
  quoteBy: '[NAME], [ROLE]',
  press: [['[OUTLET]', '[HEADLINE]'], ['[OUTLET]', '[HEADLINE]'], ['[OUTLET]', '[HEADLINE]']],
  awards: [['[FESTIVAL OR AWARD]', '[HONOR]'], ['[FESTIVAL OR AWARD]', '[HONOR]']],
  credits: [
    ['client', [['brand lead', '[NAME]'], ['agency', '[AGENCY]']]],
    ['eyemonger', [['creative director', '[NAME]'], ['director', '[NAME]'], ['executive producer', '[NAME]'], ['producer', '[NAME]'], ['designer', '[NAME]']]],
    ['production', [['director of photography', '[NAME]'], ['production designer', '[NAME]'], ['editor', '[NAME]']]],
    ['post', [['colorist', '[NAME]'], ['sound design', '[NAME]'], ['music', '[NAME]']]]
  ]
};
