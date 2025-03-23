## Description

Aggy is an autonomous AI agent that gets work done for you. You chat with Aggy and describe your problem, provide it some funds, and Aggy comes up with a solution and hires real people as contractors.

Aggy isn’t AGI - but it is part of the way there. Aggy posts tasks on its web UI that are then claimed by a contractor, a real person who can get the work done, online or in the real world. This could be mowing the lawn, building a website, or with multiple tasks, something bigger, like finding a cure for cancer.

Each task has a reward in AGGY tokens attached to it, and each contractor posts a bond in AGGY tokens to ensure that they get the work done as expected. Privy’s delegated wallets are used throughout the platform, both for improved user experience as well as to provide oversight and ultimate control for the task requester and contractor.

Aggy and contractors can share private data back and forth using Nillion's SecretVault. If a contractor is mowing your lawn, maybe it’s the garage door code. If they’re building a website, it could be your API keys.

Once a contractor completes a task and submits it, it flows through UMA Protocol, an optimistic oracle and dispute arbitration system with real, incentivized humans (and potentially other AIs) in the loop to ensure the work was done as expected. Once confirmed, the contractor automatically gets paid their reward. If the work is late or shoddy, the contractor loses their stake and it goes to the requester.

What does the future hold for Aggy? Well, why not have Aggy start to develop itself. Its source code is public, and API keys to its infrastructure and Privy credentials could be held in Nillion. Aggy could hire contractors to improve its own code and build up its treasury. Eventually…who knows? Maybe Aggy grows up into AGI after all. But what we can say for sure is that Aggy is definitely not going to become Skynet.

## How it's made

We use [n8n](https://n8n.io), a secure, AI-native open source workflow automation platform for the AI agent logic implementation.

The n8n workflow is hosted by [Autonome](https://dev.autonome.fun/autonome).

The agent uses Nillion's [SecretVault](https://docs.nillion.com/build/secret-vault) for storing private data which is revealed only to select contractors by the Agent. The agent can also use Nillion [SecretLLM](https://docs.nillion.com/build/secretLLM/overview) as a drop-in replacement for the OpenAI workflow node for the inference purposes.

Privy is used to authenticate users and delegate wallet actions to the AI agent using the [embedded wallets](https://docs.privy.io/wallets/wallets/create/overview) technology.

The smart contracts were developed in Solidity and deployed via MultiBaas, both for testing and development, as well as supporting both frontend and backend operations.

The UMA Protocol was integrated into the smart contracts via the UMA Oracle v3 (the latest). Speculative support was added for DAO governance support on the requester side via OpenZeppelin Governor, with Tally in mind.

The frontend was written in Next.js. We deployed on Vercel.
