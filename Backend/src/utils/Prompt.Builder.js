class PromptBuilder {
    static buildStoryPrompt({
        destination,
        duration,
        mood,
        language,
        templateStyle
    }){
        return `Write a ${templateStyle} travel story in ${language}.
        Destination:${destination}
        Duration:${duration}
        Mood:${mood}

        The Story should be vivid, engaging,and immeresive.
        Avoid headings.Write in paragraph form.
        `
    }
}

export default PromptBuilder;
