---
header-includes:
  - \pagenumbering{gobble}
  - \usepackage{tikz}
---

```{=latex}
\begin{tikzpicture}
    % Grid
    \draw[step=1cm,gray,very thin] (0,0) grid (4,1);
    
    % Player
    \node at (0.5, 0.5) {P}; % P for Player
    
    % Block
    \node[draw, fill=gray!30] at (1.5, 0.5) {B}; % B for Block
    
    % Free cell
    \node at (2.5, 0.5) {}; % The cell is free after the block

    % Arrow indicating movement
    \draw[->,thick] (0.5, 0.5) -- (1.3, 0.5); % The player pushes the block
    \draw[->,thick] (1.8, 0.5) -- (2.5, 0.5); % The block is moved to the right
    
    % Legend
    \node at (5.5, 0.5) {Push a block};
\end{tikzpicture}
```