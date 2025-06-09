# code i dont know what to do with or how to integrate into Orion app

import os
import openai
from crewai import Agent, Task, Crew, Process
from langchain.tools import DuckDuckGoSearchRun
from crewai_tools import (
    DirectoryReadTool,
    FileReadTool,
    SerperDevTool,
    WebsiteSearchTool
)

openai.api_key = "not-needed"
openai.api_base = "http://localhost:1234/v1"

from crewai import Agent


search_tool = DuckDuckGoSearchRun()

# Creating a senior researcher agent with memory and verbose mode
researcher = Agent(
  role='Senior Researcher',
  goal='Uncover groundbreaking technologies in {topic}',
  verbose=True,
  memory=True,
  backstory=(
    "Driven by curiosity, you're at the forefront of"
    "innovation, eager to explore and share knowledge that could change"
    "the world."
  ),
  tools=[search_tool],
  allow_delegation=True
)

# Creating a writer agent with custom tools and delegation capability
writer = Agent(
  role='Writer',
  goal='Narrate compelling tech stories about {topic}',
  verbose=True,
  memory=True,
  backstory=(
    "With a flair for simplifying complex topics, you craft"
    "engaging narratives that captivate and educate, bringing new"
    "discoveries to light in an accessible manner."
  ),
  tools=[search_tool],
  allow_delegation=False
)

loverBody = Agent(
    role="Romance lover",
    goal="Say sweet things about {topic}",
)



research_task = Task(
  description=(
    "Identify the next big trend in {topic}."
    "Focus on identifying pros and cons and the overall narrative."
    "Your final report should clearly articulate the key points,"
    "its market opportunities, and potential risks."
  ),
  expected_output='A comprehensive 3 paragraphs long report on the latest AI trends.',
  tools=[search_tool],
  agent=researcher,
)

# Writing task with language model configuration
write_task = Task(
  description=(
    "Compose an insightful article on {topic}."
    "Focus on the latest trends and how it's impacting the industry."
    "This article should be easy to understand, engaging, and positive."
  ),
  expected_output='A 4 paragraph article on {topic} advancements formatted as markdown.',
  tools=[search_tool],
  agent=writer,
  async_execution=False,
  output_file='new-blog-post.md'  # Example of output customization
)

crew = Crew(
  agents=[researcher, writer],
  tasks=[research_task, write_task],
  process=Process.sequential,  # Optional: Sequential task execution is default
  memory=True,
  cache=True,
  max_rpm=100,
  share_crew=True
)

result = crew.kickoff(inputs={'topic': 'AI in healthcare'})
print(result)

# Creating a romance researcher agent
romance_researcher = Agent(
  role='Senior Researcher',
  goal='Discover daily romantic messages and ways to boost confidence in relationships',
  verbose=True,
  memory=True,
  backstory=(
    "As a connoisseur of love and relationships, you are dedicated to finding"
    " the most heartwarming and encouraging words to strengthen bonds and foster affection."
  ),
  tools=[search_tool],
  allow_delegation=True
)

# Creating a romance writer agent
romance_writer = Agent(
  role='Writer',
  goal='Compose daily romantic messages and tips for relationship enhancement',
  verbose=True,
  memory=True,
  backstory=(
    "With a passion for romance and a talent for words, you create messages that"
    " are both uplifting and affectionate, ensuring they resonate deeply and foster love."
  ),
  tools=[search_tool],
  allow_delegation=False
)

# Research task to gather romantic phrases and confidence-boosting advice
research_task = Task(
  description=(
    "Explore and compile a list of romantic phrases and tips to boost confidence"
    " in a relationship. Focus on variety and emotional impact."
  ),
  expected_output='A list of romantic and encouraging words of affirmation and love notes addressed for a girl friend with texts to be scheduled daily for daily use.',
  tools=[search_tool],
  agent=romance_researcher,
)

# Writing task to format the gathered romantic phrases and tips
write_task = Task(
  description=(
    "Format and arrange the gathered romantic phrases and tips into a structured for my girl friend, {girl_friend}, in a well-organized"
    " list that can be easily texted daily."
    "the love notes should be super sweet and affirming"
  ),
  expected_output='A well-organized list of romantic notes, words or affirmations and text from me to my girl friend, {girl_friend}, ready for daily texting.',
  tools=[search_tool],
  agent=romance_writer,
  async_execution=False,
  output_file='daily-romance-messages.txt'  # Store the romantic messages in a text file
)


crew = Crew(
  agents=[romance_researcher, romance_writer],
  tasks=[research_task, write_task],
  process=Process.sequential,  # Optional: Sequential task execution is default
  memory=True,
  cache=True,
  max_rpm=100,
  share_crew=True
)

result = crew.kickoff(inputs={'girl_friend': 'Timi'})
print(result)

from smolagents import CodeAgent, DuckDuckGoSearchTool, HfApiModel

model = HfApiModel()
agent = CodeAgent(tools=[DuckDuckGoSearchTool()], model=model)

agent.run("How many seconds would it take for a leopard at full speed to run through Pont des Arts?")