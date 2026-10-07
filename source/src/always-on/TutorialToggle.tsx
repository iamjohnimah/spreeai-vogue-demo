import {useTutorialsEnabled,toggleTutorials} from './tutorialPreference';
export default function TutorialToggle(){
 const enabled=useTutorialsEnabled();
 return <button className="tutorial-toggle" aria-label={enabled?'Turn off all tutorials':'Turn on all tutorials'} aria-pressed={enabled} onClick={toggleTutorials}>{enabled?'Turn off tutorials':'Turn on tutorials'}</button>
}
