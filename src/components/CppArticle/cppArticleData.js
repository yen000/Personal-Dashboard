// Updated daily by scheduled task at 6pm Taiwan time
export const DAILY_ARTICLE = {
  date: '2026-06-25',
  title: 'Small Safety Improvements in the C++26 Core Language',
  source: 'Blog',
  url: 'https://www.modernescpp.com/index.php/small-safety-improvements-in-the-c-26-core-language/',
  tag: 'Daily Article',
  keyPoints: [
    'C++26 makes binding a returned reference to a temporary ill-formed (P2748R5) — compilers now emit hard errors instead of silently producing dangling references.',
    'C++26 introduces "erroneous behaviour" as a distinct category: uninitialized reads of automatic-storage variables are no longer UB but produce an arbitrary yet deterministic value, enabling better tooling and sanitizer detection.',
    'The [[indeterminate]] attribute opts out of erroneous-behaviour initialization, allowing expert code like scratch buffers or self-storage classes to skip zero-initialization without invoking UB.',
    'Automatic storage duration applies to block-scope non-static locals and function parameters — these are exactly the variables affected by the new erroneous-behaviour rule.',
    'C++26 makes delete-ing a pointer to an incomplete type with a non-trivial destructor ill-formed, catching a class of silent UB bugs that prior standards left to programmer discipline.',
  ],
}
