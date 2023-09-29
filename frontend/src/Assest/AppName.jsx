import React from 'react'
import Typewriter from 'typewriter-effect';

const AppName = () => {
    return (
        <Typewriter
            options={
                {
                    loop: true,
                    autoStart: true,
                    strings: ["<b>STORIES At Next Level</b>"],
                    // .pauseFor(2500)
                }
            }
        // onInit={(typewriter) => {
        //     typewriter.typeString('<b style={{letterSpacing: "4px"}}>Story Ranking</b>')
        //         // .callFunction(() => {
        //         //     console.log('String typed out!');
        //         // })
        //         // .deleteAll()
        //         // .callFunction(() => {
        //         //     console.log('All strings were deleted');
        //         // })
        //         .start();

        // }}
        />
    )
}

export default AppName