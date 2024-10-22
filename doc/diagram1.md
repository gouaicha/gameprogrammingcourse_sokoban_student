---
header-includes:
  - \pagenumbering{gobble}
  - \usepackage{tikz}
---

```{=latex}
\begin{tikzpicture}
    % Grille
    \draw[step=1cm,gray,very thin] (0,0) grid (3,1);    
    % Joueur
    \node at (0.5, 0.5) {P}; % P pour Player
    % Case libre
    \node at (1.5, 0.5) {}; % La case est vide
    % Flèche indiquant le mouvement
    \draw[->,thick] (0.5, 0.5) -- (1.5, 0.5);
    % Légende
    \node at (5.5, 0.5) {Free cell};
\end{tikzpicture}
```