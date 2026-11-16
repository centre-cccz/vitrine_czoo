<?php

declare(strict_types=1);

function module_permission(string $module): string
{
    return $module . '.read';
}

function module_label(string $module): string
{
    return [
        'administration' => 'Administration',
        'personnel' => 'Personnel',
        'finances' => 'Finances',
        'intendance' => 'Intendance',
        'bibliotheque' => 'Bibliothèque',
        'culture-arts' => 'Culture & Arts',
        'activites' => 'Activités',
        'projets' => 'Projets',
        'espaces' => 'Espaces',
        'patrimoine' => 'Patrimoine',
        'partenaires' => 'Partenaires',
        'documents' => 'Documents',
        'rapports' => 'Rapports',
    ][$module] ?? ucfirst($module);
}
