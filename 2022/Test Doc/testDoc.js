import { assertAxiosSpyCalledWith } from '../testUtils/SpyUtils';

describe('AgentDetailWebsiteRoute', () => {
    beforeEach(() => {
        //Axios call which runs before rendring that component.
      mockAxiosApiWithWait<
        typeof AgentControllerApi.prototype.getAgentByIdUsingGET
      >(
        AgentControllerApi,
        AgentControllerApi.prototype.getAgentByIdUsingGET,  
        DefaultAgentDetailResponse,         //Response which get after axios call.
      );
    });

    test('renders agent website route', async () => {
        //Axios call which runs before rendring that component.
        const { waitForApi } = mockAxiosApiWithWait<
          typeof AgentWebsiteControllerApi.prototype.getWebsiteByAgentIdOrSlugUsingGET
        >(
          AgentWebsiteControllerApi,
          AgentWebsiteControllerApi.prototype.getWebsiteByAgentIdOrSlugUsingGET,
          DefaultAgentWebsiteResponse,      //Response which get after axios call.
        );
    
        //Axios call which give result onclick ex button
        const {
          spy: spyUpdateWebsite,    //
          waitForApi: waitForUpdateWebsite,
        } = mockAxiosApiWithWait<
          typeof AgentWebsiteControllerApi.prototype.updateWebsiteByIdUsingPUT
        >(
          AgentWebsiteControllerApi,
          AgentWebsiteControllerApi.prototype.updateWebsiteByIdUsingPUT,
          DefaultAgentWebsiteResponse,
        );

        //Component that you want to render
        await renderRoute(          //This 'renderRoute only works for this 'bolt' project.
            AgentDetailWebsiteRoute,
            {
              agentDetail: {
                agentWebsite: DefaultAgentWebsiteResponse,
              },
            },
            {
              href: `/people/${DefaultAgentDetailResponse.id}/agent-website`,
            },
            {},
          );

            //Whatever test you do.

          await act(async () => {
            userEvent.click(
              within(publishContainer).getByRole('button', { name: 'Publish' }),
            );
          });

          assertAxiosSpyCalledWith<
            typeof AgentWebsiteControllerApi.prototype.updateWebsiteByIdUsingPUT
            >(spyUpdateWebsite, DefaultAgentWebsiteResponse.id!, {
            bottomSubtitle: 'Bottom Subtitle Create',
            bottomTitle: 'Bottom Title Create',
            ... //Data which has been used to alter.
            });

            await act(async () => {
            waitForUpdateWebsite();
            });
    });  

    //Way of using spy for mockAxiosApi call
    test('note container in agent details', async () => {
      const { waitForApi, spy } = mockAxiosApiWithWait<
        typeof NoteControllerApi.prototype.getNoteByIdUsingGET1
      >(
        NoteControllerApi,
        NoteControllerApi.prototype.getNoteByIdUsingGET1,
        DefaultNoteResponse,
      );
  
      await render(
        <NotesContainer
          entityId={DefaultAuthMeUserDetail.id}
          entityType={CreateNoteRequestEntityTypeEnum.Agent}
        />,
      );
  
      await act(async () => {
        waitForApi();
      });
  
//Amazing Way of using map in test
      screen.getAllByRole('listitem').map((list, index) => {
        const note = DefaultNoteResponse.notes[index];
  
        expect(getByText(list, note.user?.fullName!)).toBeInTheDocument();
        expect(getByText(list, note.comment!)).toBeInTheDocument();
        expect(
          getByText(
            list,
            DateTime.fromMillis(note.createdAt!).toFormat('LL/dd/yyyy')!,
          ),
        ).toBeInTheDocument();
      });
  
      assertAxiosSpyCalledWith<
        typeof NoteControllerApi.prototype.getNoteByIdUsingGET1
      >(spy, DefaultAuthMeUserDetail.id, CreateNoteRequestEntityTypeEnum.Agent);
    });
});  